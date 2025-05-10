import "./Gallery.css";
import { Viewer } from "../Viewer/Viewer";
import { useState, useRef,useEffect } from 'react';

export function Gallery({ images , viewerOpen, setViewerOpen,lastViewedIndex, onClose}) {

  const [startIndex, setStartIndex]   = useState(0);

  const thumbRefs = useRef([]);
  /* when viewer closes,  scroll to the thumb we just viewed */
  useEffect(() => {
    if (!viewerOpen && images.length) {
      const el = thumbRefs.current[lastViewedIndex];
      el?.scrollIntoView({ block: "center", inline: "center" });
    }
  }, [viewerOpen, lastViewedIndex, images]);

  if (!images.length) return <p className="loader"></p>;

  /* grid hidden once viewerOpen === true */
  if (viewerOpen) {
    return (
      <main>
      <div className="container">
        <Viewer
          images={images}
          startIndex={startIndex}
          onBack={(idx) => {                    // ✅ relay idx upward
            onClose(idx);                       // tell App
            setViewerOpen(false);               // close viewer here too
          }}
        />
      </div>
    </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="gallery">
          {images.map((src, i) => (
            <div 
              ref={(el) => (thumbRefs.current[i] = el)}
              key={i}
              className="gallery-item"
              onClick={() => { setStartIndex(i); setViewerOpen(true); }}
              >
              <img 
                src={src}
                alt={`thumb-${i}`} 
                className="gallery-image" 
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
