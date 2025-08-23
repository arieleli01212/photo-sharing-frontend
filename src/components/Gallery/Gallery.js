import "./Gallery.css";
import { Viewer } from "../Viewer/Viewer";
import { useState, useRef, useEffect, useCallback } from "react";

export function Gallery({ images, viewerOpen, setViewerOpen, lastViewedIndex, onClose }) {
  const [startIndex, setStartIndex] = useState(0);

  // --- Selection state
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set()); // membership
  const [order, setOrder] = useState(() => []);              // selection order (for numbering)
  const lastPickedRef = useRef(null);

  // --- Per-thumb errors
  const [broken, setBroken] = useState({});
  const markBroken = (i) => setBroken((b) => ({ ...b, [i]: true }));

  // For focus restore/scroll positioning
  const thumbRefs = useRef([]);

  // Announce loads for a11y
  const [announce, setAnnounce] = useState("");
  useEffect(() => {
    if (Array.isArray(images)) {
      setAnnounce(`${images.length} photo${images.length === 1 ? "" : "s"} loaded`);
    }
  }, [images]);

  // When viewer closes, restore focus to last viewed
  useEffect(() => {
    if (!viewerOpen && images?.length && lastViewedIndex != null) {
      const el = thumbRefs.current[lastViewedIndex];
      el?.scrollIntoView({ block: "center", inline: "center" });
      el?.focus({ preventScroll: false });
    }
  }, [viewerOpen, lastViewedIndex, images]);

  // ---------- Visibility kept in React state (no disappearing) ----------
  const [visible, setVisible] = useState(() => new Set()); // Set<number>
  const containerRef = useRef(null);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    setVisible(new Set());
    const items = Array.from(node.querySelectorAll(".gallery-item"));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-idx"));
            setVisible((prev) => {
              const next = new Set(prev);
              next.add(idx);
              return next;
            });
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [images]);
  // ---------------------------------------------------------------------

  // Open viewer (disabled in selection mode)
  const openViewer = useCallback(
    (i) => {
      if (selectMode) return;
      setStartIndex(i);
      setViewerOpen(true);
    },
    [setViewerOpen, selectMode]
  );

  const keyOpen = (e, i) => {
    if (selectMode) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openViewer(i);
    }
  };

  // Long-press to start selecting
  const longPressTimer = useRef(null);
  const onTouchStart = (i) => {
    if (selectMode) return;
    longPressTimer.current = setTimeout(() => {
      setSelectMode(true);
      togglePick(i);
      setAnnounce("Selection mode on");
    }, 380);
  };
  const onTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Selection helpers
  const addToOrder = (idxs) =>
    setOrder((prev) => {
      const next = prev.slice();
      for (const i of idxs) if (!next.includes(i)) next.push(i);
      return next;
    });

  const removeFromOrder = (i) =>
    setOrder((prev) => prev.filter((x) => x !== i));

  const togglePick = (i, withShift = false) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (withShift && lastPickedRef.current != null) {
        const a = Math.min(lastPickedRef.current, i);
        const b = Math.max(lastPickedRef.current, i);
        const range = [];
        for (let k = a; k <= b; k++) range.push(k);
        range.forEach((k) => next.add(k));
        addToOrder(range);
      } else {
        if (next.has(i)) {
          next.delete(i);
          removeFromOrder(i);
        } else {
          next.add(i);
          addToOrder([i]);
        }
      }
      lastPickedRef.current = i;
      return next;
    });
  };

  const onTileClick = (i, src, e) => {
    if (!selectMode) return openViewer(i);
    togglePick(i, e?.shiftKey);
  };

  // Exit / clear selection
  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
    setOrder([]);
    lastPickedRef.current = null;
    setAnnounce("Selection cleared");
  };

  // Busy/progress for share
  const [busy, setBusy] = useState(false);
  const [busyText, setBusyText] = useState("");

  const getFileName = (url, i) => {
    try {
      const clean = url.split("?")[0];
      return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1)) || `photo-${i + 1}.jpg`;
    } catch {
      return `photo-${i + 1}.jpg`;
    }
  };
  const fetchBlob = async (url) => {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`Failed ${res.status}`);
    return await res.blob();
  };

  const shareSelected = async () => {
    const idxs = Array.from(selected).sort((a, b) => a - b);
    if (idxs.length === 0) return;

    setBusy(true);
    setBusyText("Collecting photos…");

    try {
      const files = [];
      for (const i of idxs) {
        const src = images[i];
        const blob = await fetchBlob(src);
        const type = blob.type || "image/jpeg";
        files.push(new File([blob], getFileName(src, i), { type }));
        setBusyText(`Prepared ${files.length}/${idxs.length}`);
      }

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          files,
          title: "Wedding Photos",
          text: "Sharing favorite moments 💍",
        });
        setAnnounce("Share dialog opened.");
      } else {
        // Fallback: copy links (no ZIP here since you asked only Share/Cancel)
        await navigator.clipboard.writeText(idxs.map((i) => images[i]).join("\n"));
        setAnnounce("Links copied to clipboard.");
      }
    } catch (err) {
      console.error(err);
      try {
        await navigator.clipboard.writeText(idxs.map((i) => images[i]).join("\n"));
        setAnnounce("Copied links to clipboard.");
      } catch {
        setAnnounce("Couldn’t share automatically.");
      }
    } finally {
      setBusy(false);
      setBusyText("");
    }
  };

  // Empty state
  if (!images || images.length === 0) {
    return (
      <main>
        <div className="container">
          <div aria-live="polite" className="visually-hidden">{announce}</div>

          <div className="g-title">Gallery</div>

          <div className="gallery-skeletons" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-tile" />
            ))}
          </div>
          <p className="gallery-empty">
            Be the first to share a moment ✨<br />
            Tap <strong>Share Photo</strong> above.
          </p>
        </div>
      </main>
    );
  }

  // Fullscreen viewer
  if (viewerOpen) {
    return (
      <main>
        <div className="container">
          <Viewer
            images={images}
            startIndex={startIndex}
            onBack={(idx) => {
              onClose(idx);
              setViewerOpen(false);
            }}
          />
        </div>
      </main>
    );
  }

  const selectedCount = selected.size;

  return (
    <main>
      <div className="container">
        <div aria-live="polite" className="visually-hidden">{announce}</div>

        {/* Minimal sticky title */}
        <div className="g-title" role="heading" aria-level={1}>Gallery</div>

        {/* Grid */}
        <div
          className={`gallery ${selectMode ? "is-selecting" : ""}`}
          ref={containerRef}
          role="list"
          aria-label="Photo gallery"
        >
          {images.map((src, i) => {
            const brokenTile = broken[i];
            const isPicked = selected.has(i);
            const badgeNum = isPicked ? order.indexOf(i) + 1 : 0;
            const isVisibleItem = visible.has(i);

            return (
              <div
                ref={(el) => (thumbRefs.current[i] = el)}
                key={i}
                data-idx={i}
                className={`gallery-item${brokenTile ? " is-broken" : ""}${isPicked ? " is-picked" : ""}${isVisibleItem ? " is-visible" : ""}`}
                role={selectMode ? "checkbox" : "button"}
                aria-checked={selectMode ? (isPicked ? "true" : "false") : undefined}
                tabIndex={0}
                aria-label={
                  selectMode
                    ? `${isPicked ? "Unselect" : "Select"} photo ${i + 1}`
                    : brokenTile
                    ? "Image failed to load. Retry"
                    : `Open photo ${i + 1} of ${images.length}`
                }
                onClick={(e) => onTileClick(i, src, e)}
                onKeyDown={(e) =>
                  selectMode
                    ? (e.key === " " || e.key === "Enter") &&
                      (e.preventDefault(), togglePick(i, e.shiftKey))
                    : keyOpen(e, i)
                }
                onTouchStart={() => onTouchStart(i)}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchEnd}
              >
                {/* iOS-style check bubble (order number) */}
                {selectMode && (
                  <div className={`select-check${isPicked ? " is-on" : ""}`} aria-hidden>
                    {isPicked ? badgeNum : ""}
                  </div>
                )}

                {!brokenTile ? (
                  <>
                    <img
                      src={src}
                      alt={`Photo ${i + 1}`}
                      className="gallery-image"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      onError={() => markBroken(i)}
                      onContextMenu={(e) => e.preventDefault()}
                    />

                    {/* Dim / hint overlay when selected */}
                    <div className={`pick-mask${isPicked ? " is-on" : ""}`} aria-hidden />

                    <div className="gallery-overlay" aria-hidden>
                      <span className="overlay-icon">
                        {selectMode ? (isPicked ? "✓" : "○") : "🔍"}
                      </span>
                      <span className="overlay-text">
                        {selectMode ? (isPicked ? "Selected" : "Select") : "View"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="broken-tile">
                    <div className="broken-emoji" aria-hidden>🛠️</div>
                    <div className="broken-text">Couldn’t load this photo.</div>
                    <div className="broken-hint">Tap to try again</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating glass speed-dial (bottom-right) */}
      <div className={`fab-dock ${selectMode ? "fab-open" : ""}`} role="region" aria-label="Selection actions">
        {/* Main FAB */}
        {!selectMode ? (
          <button
            className="fab-main"
            onClick={() => { setSelectMode(true); setAnnounce("Selection mode on"); }}
            aria-label="Select photos"
            title="Select photos"
          >
            ✓ Select
          </button>
        ) : (
          <>
            <button
              className="fab-main fab-active"
              onClick={() => { /* keep open in select mode */ }}
              aria-label="Selection actions"
              title="Selection actions"
            >
              ✓ Select
            </button>

            {/* Actions slide out to the left (staggered) */}
            <button
              className="fab-action fab-cancel"
              style={{ "--i": 1 }}
              onClick={exitSelectMode}
              aria-label="Cancel selection"
              title="Cancel"
            >
              ✖ Cancel
            </button>

            <button
              className="fab-action fab-share"
              style={{ "--i": 2 }}
              onClick={shareSelected}
              disabled={selectedCount === 0 || busy}
              aria-label="Share selected"
              title={busy ? "Working…" : "Share"}
            >
              📤 Share
            </button>

            <div
              className="fab-chip fab-count"
              style={{ "--i": 3 }}
              aria-live="polite"
              title={`${selectedCount} selected`}
            >
              {busy ? (busyText || "Working…") : `${selectedCount} selected`}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
