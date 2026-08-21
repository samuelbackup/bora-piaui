import { useEffect, useState } from "react";

export function AppLoadingOverlay() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    const enterFrame = window.requestAnimationFrame(() => setReady(true));
    const exitTimer = window.setTimeout(() => setReady(false), 150);
    const removeTimer = window.setTimeout(() => setVisible(false), 380);

    return () => {
      window.cancelAnimationFrame(enterFrame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`app-loading-overlay ${ready ? "app-loading-overlay--ready" : ""}`}
      data-testid="app-loading-overlay"
    >
      <div className="app-loading-mark">
        <span className="app-loading-sun" />
        <span className="display-font text-2xl tracking-[-0.06em]">bora <span>piauí</span></span>
      </div>
    </div>
  );
}
