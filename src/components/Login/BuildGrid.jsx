import React, { useEffect, useMemo } from "react";

/**
 * Puzzle-style build/shatter overlay.
 * - phase: "enter" (build in) | "exit" (break out)
 * - pattern: "serpentine" sequential order (row by row, alternating direction)
 * - onEnterDone / onExitDone fire after animations finish.
 * Respects prefers-reduced-motion (skips and calls done immediately).
 */
export default function BuildGrid({
  phase = "enter",
  rows = 12,
  cols = 16,
  pattern = "serpentine",
  step = 0.0085,   // seconds between tiles for ENTER (≈1.6s total for 12x16)
  outStep = 0.006, // seconds between tiles for EXIT  (≈1.1s total)
  onEnterDone,
  onExitDone,
}) {
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  // Build deterministic sequencing and exit directions.
  const tiles = useMemo(() => {
    const list = [];
    const count = rows * cols;

    const idxFor = (r, c) => {
      if (pattern === "serpentine") {
        const leftToRight = r % 2 === 0;
        return r * cols + (leftToRight ? c : cols - 1 - c);
      }
      // Fallback: row-major
      return r * cols + c;
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const orderIndex = idxFor(r, c);
        // exit randomness but consistent per tile
        const seed = frac((orderIndex + 1) * 0.61803398875);
        const angle = seed * Math.PI * 2;
        const travel = 120 + 60 * frac(seed * 17.3);
        const outDx = Math.cos(angle) * travel;
        const outDy = Math.sin(angle) * travel;
        const rot = (frac(seed * 97.7) - 0.5) * 90;

        list.push({
          key: orderIndex,
          r,
          c,
          di: orderIndex * step,     // enter delay
          do: orderIndex * outStep,  // exit delay
          outDx,
          outDy,
          rot,
        });
      }
    }
    // Sort by the sequential order key so rendering is stable (not required but nice)
    list.sort((a, b) => a.key - b.key);
    return list;
  }, [rows, cols, pattern, step, outStep]);

  // Fire completion callbacks with precise timing.
  useEffect(() => {
    if (reduceMotion) {
      if (phase === "enter") onEnterDone?.();
      else onExitDone?.();
      return;
    }
    const ENTER_DUR = 0.32;  // must match CSS --tile-in-dur
    const EXIT_DUR  = 0.55;  // must match CSS --tile-out-dur
    const FADE_DUR  = 0.20;  // overlay fade at end of enter

    let t;
    if (phase === "enter") {
      const total = tiles.length ? tiles[tiles.length - 1].di + ENTER_DUR + FADE_DUR : 0;
      t = setTimeout(() => onEnterDone?.(), (total + 0.02) * 1000);
    } else {
      const total = tiles.length ? tiles[tiles.length - 1].do + EXIT_DUR : 0;
      t = setTimeout(() => onExitDone?.(), (total + 0.02) * 1000);
    }
    return () => clearTimeout(t);
  }, [phase, tiles, reduceMotion, onEnterDone, onExitDone]);

  // Provide overlay fade timing to CSS for a smooth handoff
  const overlayDelay =
    (phase === "enter" && tiles.length ? tiles[tiles.length - 1].di + 0.32 : 0).toFixed(3) + "s";

  return (
    <div
      className={`buildgrid ${phase === "enter" ? "is-entering" : "is-exiting"}`}
      aria-hidden="true"
      style={{ "--rows": rows, "--cols": cols, "--overlayDelay": overlayDelay }}
    >
      <div className="buildgrid-inner">
        {tiles.map((t) => (
          <span
            key={t.key}
            className="sq"
            style={{
              "--di": `${t.di}s`,
              "--do": `${t.do}s`,
              "--dx": `${Math.round(t.outDx)}px`,
              "--dy": `${Math.round(t.outDy)}px`,
              "--rot": `${t.rot}deg`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function frac(x) {
  return x - Math.floor(x);
}
