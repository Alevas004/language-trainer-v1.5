import type { ReactNode } from "react";
import type { SubcomponentId } from "@/types";
import "./ChapterEmblem.css";

interface ChapterEmblemProps {
  chapter: SubcomponentId | "boss";
  size?: number; // diámetro en píxeles
}

// Un icono de línea por capítulo, dibujado en SVG (sin emojis)
const ICONS: Record<ChapterEmblemProps["chapter"], ReactNode> = {
  // Bosque de los Sonidos: un pino con ondas de sonido
  phonology: (
    <>
      <path d="M19 6 L10 20 H15 L7 32 H31 L23 20 H28 Z" />
      <path d="M19 32 V41" />
      <path d="M35 17 q4 4 0 8" />
      <path d="M40 12 q7 9 0 18" />
    </>
  ),
  // Taller de las Frases: fichas de palabras en renglones
  morphosyntax: (
    <>
      <rect x="6" y="9" width="14" height="9" rx="2.5" />
      <rect x="23" y="9" width="19" height="9" rx="2.5" />
      <rect x="6" y="23" width="22" height="9" rx="2.5" />
      <rect x="31" y="23" width="11" height="9" rx="2.5" />
      <path d="M6 39 H42" />
    </>
  ),
  // Jardín de las Palabras: un brote con dos hojas
  lexicon: (
    <>
      <path d="M24 42 V23" />
      <path d="M24 29 C14 29 10 22 10 15 C18 15 24 19 24 29 Z" />
      <path d="M24 23 C24 15 30 11 38 11 C38 19 33 24 24 23 Z" />
      <path d="M14 42 H34" />
    </>
  ),
  // Plaza de las Conversaciones: dos globos de diálogo
  pragmatics: (
    <>
      <path d="M7 8 H29 a4 4 0 0 1 4 4 V21 a4 4 0 0 1 -4 4 H17 L11 30 V25 H7 a4 4 0 0 1 -4 -4 V12 a4 4 0 0 1 4 -4 Z" />
      <path d="M22 28 H41 a4 4 0 0 1 4 4 V38 a4 4 0 0 1 -4 4 H39 V47 L33 42 H22 a4 4 0 0 1 -4 -4 V32 a4 4 0 0 1 4 -4 Z" style={{ fill: "var(--tint)" }} />
    </>
  ),
  // La Gran Página: una estrella
  boss: <path d="M24 5 L29.4 17 L42 18.4 L32.7 27 L35.3 39.5 L24 33.2 L12.7 39.5 L15.3 27 L6 18.4 L18.6 17 Z" />,
};

const ChapterEmblem = ({ chapter, size = 56 }: ChapterEmblemProps) => {
  return (
    <span
      className={`emblem chapter-${chapter}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width={size * 0.64} height={size * 0.64}>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ICONS[chapter]}
        </g>
      </svg>
    </span>
  );
};

export default ChapterEmblem;
