import { useEffect, useRef, useState } from "react";
import { ViewerHeader } from "../ViewerHeader/ViewerHeader";
import "./Viewer.css";

/**
 * Viewer (CORS-free contrast):
 * - Bottom scrim ensures readable glass buttons on any photo
 * - Smooth reveal, skeletons, retry for errors
 * - Keyboard nav (↑ ↓ Space PgUp PgDn Home End)
 * - Share (Web Share API + clipboard fallback)
 * - Save (Blob download with fallback)
 * - Neighbor preloading
 * - Back-to-top FAB
 * - ARIA live announcements
 */
export function Viewer({ images = [], startIndex = 0, onBack, headerRef }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [current, setCurrent] = useState(startIndex);
  const currentRef = useRef(current);

  const [visible, setVisible] = useState(() => new Set());
  const [loaded, setLoaded] = useState(() => new Set());
  const [broken, setBroken] = useState({});
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    currentRef.current = current;
    if (images.length) setAnnounce(`Photo ${current + 1} of ${images.length}`);
  }, [current, images.length]);

  // Scroll the opening photo into view
  useEffect(() => {
    if (startIndex >= 0 && startIndex < images.length) {
      itemRefs.current[startIndex]?.scrollIntoView({ block: "center" });
      itemRefs.current[startIndex]?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Track current by element closest to vertical centre
  useEffect(() => {
    const handleScroll = () => {
      const headerH =
        headerRef && headerRef.current
          ? headerRef.current.getBoundingClientRect().height
          : 0;
      const centreLine = headerH + (window.innerHeight - headerH) / 2;
      let bestIdx = currentRef.current;
      let bestDist = Infinity;
      itemRefs.current.forEach((li, i) => {
        if (!li) return;
        const r = li.getBoundingClientRect();
        const liCentre = r.top + r.height / 2;
        const dist = Math.abs(liCentre - centreLine);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      if (bestIdx !== currentRef.current) setCurrent(bestIdx);
    };
    const handleResize = () => handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [headerRef]);

  // Reveal-on-scroll
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const els = Array.from(node.querySelectorAll(".viewer-item"));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible((prev) => new Set(prev).add(e.target.dataset.idx));
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [images]);

  // Preload neighbors
  useEffect(() => {
    const preload = (idx) => {
      if (idx < 0 || idx >= images.length) return;
      const img = new Image();
      img.src = images[idx];
    };
    preload(current + 1);
    preload(current + 2);
    preload(current - 1);
  }, [current, images]);

  // Load/error helpers
  const markLoaded = (i) => setLoaded((s) => new Set(s).add(i));
  const markBroken = (i) => setBroken((b) => ({ ...b, [i]: true }));

  const retryImage = (i, src) => {
    const test = new Image();
    test.onload = () => {
      setBroken((b) => { const c = { ...b }; delete c[i]; return c; });
      setLoaded((s) => new Set(s).add(i));
      const el = itemRefs.current[i]?.querySelector("img");
      if (el) el.src = src + (src.includes("?") ? "&" : "?") + "t=" + Date.now();
      setAnnounce("Photo reloaded.");
    };
    test.onerror = () => setTimeout(() => retryImage(i, src), 1000);
    test.src = src + (src.includes("?") ? "&" : "?") + "t=" + Date.now();
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (!images.length) return;
      const scrollToIdx = (idx) => {
        if (idx < 0 || idx >= images.length) return;
        itemRefs.current[idx]?.scrollIntoView({ block: "center", behavior: "smooth" });
      };
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault(); scrollToIdx(currentRef.current + 1); break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault(); scrollToIdx(currentRef.current - 1); break;
        case "Home":
          e.preventDefault(); scrollToIdx(0); break;
        case "End":
          e.preventDefault(); scrollToIdx(images.length - 1); break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Share current image (Web Share API + clipboard fallback)
  const shareImage = async (src) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Wedding Photo", text: "Sharing a favorite moment 💍", url: src });
        setAnnounce("Share dialog opened.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(src);
        setAnnounce("Link copied to clipboard.");
      } else {
        window.open(src, "_blank");
      }
    } catch { /* user cancelled */ }
  };

  // Save current image (Blob download + fallback)
  const saveImage = async (src) => {
    try {
      const res = await fetch(src, { mode: "cors" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const fname = src.split("/").pop()?.split("?")[0] || "photo.jpg";
      a.href = url; a.download = fname;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      setAnnounce("Download started.");
    } catch {
      window.open(src, "_blank", "noopener");
    }
  };

  return (
    <>
      <ViewerHeader current={current} onBack={onBack} />

      <section className="viewer" ref={containerRef}>
        <div aria-live="polite" className="visually-hidden">{announce}</div>

        <ul className="viewer-list" role="list" aria-label="Photo viewer">
          {images.map((src, i) => {
            const isVisible = visible.has(String(i));
            const isLoaded = loaded.has(i);
            const isBroken = !!broken[i];

            return (
              <li
                key={`${src}-${i}`}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`viewer-item${isVisible ? " is-visible" : ""}${isBroken ? " is-broken" : ""}`}
                data-idx={i}
                tabIndex={0}
                aria-label={isBroken ? "Image failed to load. Retry" : `Photo ${i + 1}`}
                onClick={() => { if (isBroken) retryImage(i, src); }}
              >
                {!isLoaded && !isBroken && <div className="skeleton" aria-hidden />}

                {!isBroken ? (
                  <img
                    src={src}
                    alt={`Photo ${i + 1} of ${images.length}`}
                    className={`viewer-img${isLoaded ? " is-loaded" : ""}`}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    onLoad={() => markLoaded(i)}
                    onError={() => markBroken(i)}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className="broken">
                    <div className="broken-emoji" aria-hidden>🧩</div>
                    <div className="broken-text">We couldn’t load this photo.</div>
                    <button
                      className="broken-retry"
                      onClick={(e) => { e.stopPropagation(); retryImage(i, src); }}
                      aria-label="Try to reload the photo"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Bottom scrim + glass controls (no CORS needed) */}
                <div className="viewer-scrim" aria-hidden></div>
                <div className="viewer-tools" aria-hidden>
                  <button
                    type="button"
                    className="viewer-btn viewer-share"
                    title="Share"
                    onClick={(e) => { e.stopPropagation(); shareImage(src); }}
                  >
                    <span className="btn-icn" aria-hidden>📤</span>
                    <span className="btn-txt">Share</span>
                  </button>
                  <button
                    type="button"
                    className="viewer-btn viewer-save"
                    title="Save"
                    onClick={(e) => { e.stopPropagation(); saveImage(src); }}
                  >
                    <span className="btn-icn" aria-hidden>⬇️</span>
                    <span className="btn-txt">Save</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {current > 0 && (
          <button className="scroll-top" onClick={scrollTop} aria-label="Back to top" title="Back to top">
            ↑
          </button>
        )}
      </section>
    </>
  );
}
