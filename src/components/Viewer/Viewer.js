// components/Viewer/Viewer.jsx
import { useEffect, useRef, useState  } from "react";
import { ViewerHeader } from "../ViewerHeader/ViewerHeader";
import "./Viewer.css";

export function Viewer({ images, startIndex, onBack  }) {
  const containerRef = useRef(null);
  const itemRefs     = useRef([]);       // keep refs to every li
  const [current, setCurrent] = useState(startIndex);

  /* scroll first image into view on mount */
  useEffect(() => {
    itemRefs.current[startIndex]?.scrollIntoView({ block: "center" });
  }, [startIndex]);

    /* detect which item is visually closest to the viewport centre */
    const handleScroll = () => {
        const header = document.querySelector(".posts-header");
        const headerH = header ? header.getBoundingClientRect().height : 0;
    
        const centreLine = headerH + (window.innerHeight - headerH) / 2;
    
        let bestIdx = current;
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
    
        if (bestIdx !== current) {
        setCurrent(bestIdx);
        }
    };
  

    // bind / unbind once
    useEffect(() => {
       window.addEventListener("scroll", handleScroll, { passive: true });
       return () => window.removeEventListener("scroll", handleScroll);
    });

  return (
    <>
      <ViewerHeader current={current} onBack={onBack} />

      <section
        className="viewer"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <ul className="viewer-list">
          {images.map((src, i) => (
            <li
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className="viewer-item"
            >
              <img src={src} alt={`full-${i}`} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
