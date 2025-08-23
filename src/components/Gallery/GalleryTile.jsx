import { memo, useRef } from "react";
import useLongPress from "./useLongPress";

function rangeBetween(a, b){
  const min = Math.min(a,b), max = Math.max(a,b);
  return Array.from({length: max-min+1}, (_,k)=>min+k);
}

const GalleryTile = memo(function GalleryTile({
  idx, src, visible, selected, badgeNum, selectMode,
  onOpen, onToggle, onEnterSelect
}) {
  const lastIdxRef = useRef(null);
  const bindLong = useLongPress(() => { onEnterSelect(); onToggle(); }, { delay: 380 });

  const onClick = (e) => {
    if (!selectMode) return onOpen();
    // Shift-range on desktop
    if (e.shiftKey && lastIdxRef.current != null) {
      onToggle(rangeBetween(lastIdxRef.current, idx));
    } else {
      onToggle();
    }
    lastIdxRef.current = idx;
  };

  return (
    <div
      className={`gallery-item${selected ? " is-picked" : ""}${visible ? " is-visible" : ""}`}
      data-idx={idx}
      role={selectMode ? "checkbox" : "button"}
      aria-checked={selectMode ? String(!!selected) : undefined}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!selectMode && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpen(); }
        if (selectMode && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(e); }
      }}
      {...bindLong}
    >
      {selectMode && (
        <div className={`select-check${selected ? " is-on" : ""}`} aria-hidden>
          {selected ? badgeNum : ""}
        </div>
      )}

      <img
        src={src}
        alt={`Photo ${idx + 1}`}
        className="gallery-image"
        loading="lazy"
        decoding="async"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className={`pick-mask${selected ? " is-on" : ""}`} aria-hidden />
      <div className="gallery-overlay" aria-hidden>
        <span className="overlay-icon">
          {selectMode ? (selected ? "✓" : "○") : "🔍"}
        </span>
        <span className="overlay-text">
          {selectMode ? (selected ? "Selected" : "Select") : "View"}
        </span>
      </div>
    </div>
  );
});

export default GalleryTile;
