import React, { useEffect, useState } from "react";
import "./ViewerHeader.css";

export function ViewerHeader({ onBack, current, total }) {
  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        const pct = Math.min(1, Math.max(0, window.scrollY / max));
        setProgress(pct);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("orientationchange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("orientationchange", onScroll);
    };
  }, []);

  const idx =
    typeof current === "number" && Number.isFinite(current) ? current + 1 : null;

  return (
    <header className="vh" role="banner">
      {/* ultra-thin progress at the very top */}
      <div className="vh__progress" aria-hidden>
        <div
          className="vh__bar"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <button
        className="vh__back"
        onClick={() => onBack(current)}
        aria-label="Back to gallery"
        title="Back to gallery"
      >
        <span className="vh__back-icn" aria-hidden>←</span>
        <span className="vh__back-txt">Back</span>
      </button>

      <div className="vh__center">
        <h1 className="vh__title">Gallery</h1>
        {idx && (
          <div className="vh__pos" aria-live="polite">
            {total ? (
              <>
                {idx}<span className="vh__sep">/</span>{total}
              </>
            ) : (
              <>{idx}</>
            )}
          </div>
        )}
      </div>

      {/* right spacer to balance layout (keeps title centered) */}
      <div className="vh__spacer" aria-hidden />
    </header>
  );
}
