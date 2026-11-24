import type { Mode } from "@/types";

export const PRAISE = [
  "¡Muy bien!",
  "¡Eso es!",
  "¡Excelente!",
  "¡Lo lograste!",
  "¡Así se hace!",
];

export const TRY_AGAIN = [
  "Mmm, probemos otra vez.",
  "Casi. Mira con calma.",
  "Pensemos juntos.",
  "No pasa nada, inténtalo de nuevo.",
];

export const pickOne = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const isSupport = (mode: Mode): boolean => mode === "support";

export const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** Cuántas opciones se muestran: la nivelación usa menos */
export const optionCount = (mode: Mode, normal = 4): number =>
  mode === "support" ? 2 : normal;
