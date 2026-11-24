import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

interface DragDropOptions<T> {
  onDrop: (payload: T, targetId: string) => void; // soltó sobre un [data-drop]
  onTap: (payload: T) => void; // clic simple (o teclado) sin arrastrar
}

interface Ghost {
  x: number;
  y: number;
  content: ReactNode;
}

/**
 * Arrastrar y soltar con eventos de puntero (funciona con la varita y en táctil).
 * Un clic sin movimiento cuenta como "tocar", así cada pieza se puede mover
 * con un clic o arrastrando. Los destinos se marcan con data-drop="id".
 */
export const useDragDrop = <T,>({ onDrop, onTap }: DragDropOptions<T>) => {
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const drag = useRef<{
    payload: T;
    startX: number;
    startY: number;
    moved: boolean;
    content: ReactNode;
  } | null>(null);

  const bind = useCallback(
    (payload: T, content: ReactNode) => ({
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          payload,
          startX: event.clientX,
          startY: event.clientY,
          moved: false,
          content,
        };
      },
      onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
        const current = drag.current;
        if (!current) return;
        if (
          !current.moved &&
          Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 6
        ) {
          current.moved = true;
        }
        if (current.moved) {
          setGhost({ x: event.clientX, y: event.clientY, content: current.content });
        }
      },
      onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
        const current = drag.current;
        drag.current = null;
        setGhost(null);
        if (!current) return;
        if (!current.moved) {
          onTap(current.payload);
          return;
        }
        const target = document
          .elementsFromPoint(event.clientX, event.clientY)
          .find(
            (node): node is HTMLElement =>
              node instanceof HTMLElement && node.dataset.drop !== undefined
          );
        if (target?.dataset.drop) onDrop(current.payload, target.dataset.drop);
      },
      onPointerCancel: () => {
        drag.current = null;
        setGhost(null);
      },
      // Teclado: Enter o espacio equivalen a tocar la pieza
      onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onTap(payload);
        }
      },
    }),
    [onDrop, onTap]
  );

  return { bind, ghost };
};
