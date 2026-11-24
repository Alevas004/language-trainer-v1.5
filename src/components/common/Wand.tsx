import { useEffect, useRef } from "react";
import { useSettings } from "@/hook/useSettings";
import "./Wand.css";

// Varita mágica que reemplaza al cursor. La punta (la estrella) es el punto de clic.
// Se mueve escribiendo variables CSS directamente, sin volver a renderizar React.
const Wand = () => {
  const { settings } = useSettings();
  const wandRef = useRef<HTMLDivElement>(null);
  const enabled = settings.wandEnabled;

  useEffect(() => {
    const wand = wandRef.current;
    if (!enabled || !wand) return;

    document.documentElement.classList.add("wand-on");

    const show = (event: PointerEvent) => {
      // En pantallas táctiles no hay cursor: no se muestra la varita
      if (event.pointerType === "touch") {
        wand.classList.remove("wand-visible");
        return;
      }
      wand.style.setProperty("--x", `${event.clientX}px`);
      wand.style.setProperty("--y", `${event.clientY}px`);
      wand.classList.add("wand-visible");
    };
    const press = () => wand.classList.add("wand-pressed");
    const release = () => wand.classList.remove("wand-pressed");
    const hide = () => wand.classList.remove("wand-visible");

    document.addEventListener("pointermove", show);
    document.addEventListener("pointerdown", show);
    document.addEventListener("pointerdown", press);
    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", release);
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      document.documentElement.classList.remove("wand-on");
      document.removeEventListener("pointermove", show);
      document.removeEventListener("pointerdown", show);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", release);
      document.documentElement.removeEventListener("pointerleave", hide);
      wand.classList.remove("wand-visible", "wand-pressed");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wandRef} className="wand" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* varita */}
        <line
          x1="13"
          y1="13"
          x2="56"
          y2="56"
          stroke="#8b7a66"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="42"
          y1="42"
          x2="56"
          y2="56"
          stroke="#5e5043"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* estrella de la punta, centrada en (9, 9) */}
        <path
          d="M9 0.5 L11.4 6.4 L17.7 6.9 L12.9 11 L14.4 17.2 L9 13.9 L3.6 17.2 L5.1 11 L0.3 6.9 L6.6 6.4 Z"
          fill="#e0c46f"
          stroke="#8f7634"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Wand;
