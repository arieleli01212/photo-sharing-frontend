// components/Viewer/Viewer.jsx
import { useEffect, useRef, useState  } from "react";
import { ViewerHeader } from "../ViewerHeader/ViewerHeader";
import "./Viewer.css";

export function Viewer({ images, startIndex, onBack, headerRef }) {
  const containerRef = useRef(null);
  const itemRefs     = useRef([]);       // keep refs to every li
  const [current, setCurrent] = useState(startIndex);

  // Ref to always access the latest current value inside the handler
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  /* scroll first image into view on mount */
  useEffect(() => {
    if (
      Array.isArray(images) &&
      typeof startIndex === "number" &&
      startIndex >= 0 &&
      startIndex < images.length
    ) {
      itemRefs.current[startIndex]?.scrollIntoView({ block: "center" });
    }
  }, [images, startIndex]);

  // bind / unbind once, and ensure latest current is used
  useEffect(() => {
    const handleScroll = () => {
      const headerH = headerRef && headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
      const centreLine = headerH + (window.innerHeight - headerH) / 2;
      let bestIdx = currentRef.current;
      let bestDist = Infinity;
      itemRefs.current.forEach((li, i) => {
        if (!li) return;
        const r = li.getBoundingClientRect();
        const liCentre = r.top + r.height / 2;
        const dist = Math.abs(liCentre - centreLine);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      if (bestIdx !== currentRef.current) {
        setCurrent(bestIdx);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerRef]);

  return (
    <>
      <ViewerHeader current={current} onBack={onBack} />

      <section
        className="viewer"
        ref={containerRef}
      >
        <ul className="viewer-list">
          {images.map((src, i) => (
            <li
              key={`${src}-${i}`}
              ref={(el) => (itemRefs.current[i] = el)}
              className="viewer-item"
              tabIndex={0}
            >
              <img src={src} alt={`Photo ${i + 1} of ${images.length}`} loading="lazy" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}