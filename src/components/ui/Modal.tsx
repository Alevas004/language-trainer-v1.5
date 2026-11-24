import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import Button from "./Button";
import "./Modal.css";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  hideClose?: boolean;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Ventana modal propia (no usa <dialog>) para que la varita siempre se vea encima
const Modal = ({ open, title, onClose, children, wide, hideClose }: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Al abrir, el foco entra a la ventana; al cerrar, vuelve a donde estaba
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const target =
      panel?.querySelector<HTMLElement>("[data-autofocus]") ??
      panel?.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();
    return () => previous?.focus();
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
      >
        <header className="modal-header">
          <h2 id={titleId}>{title}</h2>
          {!hideClose && (
            <Button variant="quiet" onClick={onClose}>
              Cerrar
            </Button>
          )}
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
