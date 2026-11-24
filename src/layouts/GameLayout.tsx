import { useState, type ReactNode } from "react";
import ChapterEmblem from "@/components/common/ChapterEmblem";
import Companion from "@/components/common/Companion";
import HintBubble from "@/components/common/HintBubble";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { LoroExpression, SubcomponentId } from "@/types";
import BookLayout from "./BookLayout";
import "./GameLayout.css";

interface GameLayoutProps {
  chapterId: SubcomponentId | "boss";
  numeral?: string; // número romano del capítulo (va en el marcapáginas)
  title: string;
  onBack: () => void;
  onHome: () => void; // vuelve directo a la portada, sin pasar por cada pantalla
  onHelp?: () => void; // si se da, "Ayuda" y Señor Loro piden una pista del ejercicio
  rules?: ReactNode;
  expression: LoroExpression;
  message?: string; // lo que dice Señor Loro en este momento
  helpText: string; // lo que dice cuando se toca "Ayuda"
  children: ReactNode;
}

const StarRibbon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-label="Última página">
    <path
      d="M24 4 L30 18 L45 19.5 L34 29.5 L37 44 L24 36.5 L11 44 L14 29.5 L3 19.5 L18 18 Z"
      fill="currentColor"
    />
  </svg>
);

// Marco común de todos los juegos, como un libro abierto: a la izquierda,
// Señor Loro y sus pistas; a la derecha, la actividad. Volver, Inicio, Reglas
// y Ayuda están siempre en el mismo lugar.
const GameLayout = ({
  chapterId,
  numeral,
  title,
  onBack,
  onHome,
  onHelp,
  rules,
  expression,
  message,
  helpText,
  children,
}: GameLayoutProps) => {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const shownMessage = helpOpen && !onHelp ? helpText : message;

  // En un ejercicio, la ayuda es una pista; en las demás pantallas, un consejo general
  const handleHelp = () => (onHelp ? onHelp() : setHelpOpen((open) => !open));

  const side = (
    <aside className="side">
      <div className="side-chapter">
        <ChapterEmblem chapter={chapterId} size={64} />
        <p className="side-caption">{numeral ? `Capítulo ${numeral}` : "Última página"}</p>
      </div>

      <div className="side-companion">
        <button
          type="button"
          className="companion-btn"
          aria-label="Pedir ayuda a Señor Loro"
          aria-pressed={helpOpen && !onHelp}
          onClick={handleHelp}
        >
          <Companion
            expression={helpOpen && !onHelp ? "explaining" : expression}
            size={190}
          />
        </button>
        {shownMessage ? (
          <HintBubble message={shownMessage} />
        ) : (
          <p className="side-quiet">Toca a Señor Loro si necesitas ayuda.</p>
        )}
      </div>
    </aside>
  );

  return (
    <BookLayout
      left={side}
      leftLast
      leftWidth="minmax(270px, 0.62fr)"
      ribbon={numeral ?? <StarRibbon />}
    >
      <div className="game">
        <header className="game-bar">
          <div className="game-bar-nav">
            <Button variant="quiet" onClick={onBack}>
              ← Volver
            </Button>
            <Button variant="quiet" onClick={onHome}>
              Inicio
            </Button>
          </div>
          <div className="game-bar-actions">
            <Button variant="quiet" disabled={!rules} onClick={() => setRulesOpen(true)}>
              Reglas
            </Button>
            <Button variant="quiet" aria-pressed={helpOpen && !onHelp} onClick={handleHelp}>
              Ayuda
            </Button>
          </div>
        </header>

        <h1 className="game-title">
          {numeral && <span className="title-numeral">{numeral}. </span>}
          {title}
        </h1>

        <div className="game-body">{children}</div>
      </div>

      <Modal open={rulesOpen} title="Reglas" onClose={() => setRulesOpen(false)} wide>
        {rules}
      </Modal>
    </BookLayout>
  );
};

export default GameLayout;
