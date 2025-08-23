import { useRef } from "react";
export default function useLongPress(onLong, { delay = 380 } = {}) {
  const t = useRef(null);
  return {
    onTouchStart: () => { t.current = setTimeout(onLong, delay); },
    onTouchEnd:   () => { if (t.current) { clearTimeout(t.current); t.current = null; } },
    onTouchMove:  () => { if (t.current) { clearTimeout(t.current); t.current = null; } },
  };
}
