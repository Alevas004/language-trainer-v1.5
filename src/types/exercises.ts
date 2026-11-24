import type { LevelNumber, Mode } from "@/types";
import type { SoundKind } from "@/utils/tones";

/** Personaje que habla en una situación (pragmática) */
export interface Speaker {
  name: string;
  emoji: string;
  expression?: string; // emoji de la cara
  tone?: string; // cómo lo dice ("con voz alegre")
}

/** Lo que se muestra antes de las opciones */
export interface Stimulus {
  emoji?: string;
  emojiRepeat?: number; // por ejemplo, 3 gatos
  sentence?: string; // "___" marca el hueco
  speaker?: Speaker;
  line?: string; // lo que dice el personaje
  sounds?: SoundKind[]; // sonidos no verbales
}

export interface ChoiceOption {
  id: string;
  emoji?: string;
  text?: string;
  say?: string; // lo que se oye al tocar el altavoz de la opción
  reply?: string; // respuesta natural del personaje si se elige esta opción
  explain?: string; // explicación de Señor Loro si se elige esta opción
}

interface BaseExercise {
  id: string;
  instruction: string;
  speak?: string; // audio que se oye al empezar (y con el botón "Escuchar")
  hints: string[]; // pistas escalonadas, de la más suave a la más clara
  success?: string; // lo que dice Señor Loro al acertar
  stimulus?: Stimulus;
}

export interface ChoiceExercise extends BaseExercise {
  kind: "choice";
  options: ChoiceOption[];
  correct: string;
  layout: "pictures" | "words" | "sentences";
}

export interface TallyExercise extends BaseExercise {
  kind: "tally";
  target: number;
  unit: string; // "palabra", "sílaba"
  units?: string[]; // apoyo visual (modo con ayuda extra)
}

export interface Token {
  id: string;
  value: string; // lo que se compara con la respuesta
  text?: string;
  emoji?: string;
  caption?: string;
}

export type TemplatePart = { text: string } | { slot: number };

/** Ordenar palabras, completar huecos o poner viñetas en orden */
export interface SlotsExercise extends BaseExercise {
  kind: "slots";
  template: TemplatePart[];
  answers: string[]; // valor esperado en cada hueco
  bank: Token[];
  prefilled?: Token[]; // fichas ya colocadas desde el inicio (apoyo)
  tokenLayout: "words" | "cards";
  slotLabels?: string[];
}

export interface SortGroup {
  id: string;
  label: string;
  emoji?: string;
}

export interface SortItem {
  id: string;
  emoji: string;
  label: string;
  group: string;
}

export interface SortExercise extends BaseExercise {
  kind: "sort";
  groups: SortGroup[];
  items: SortItem[];
}

export type Exercise =
  | ChoiceExercise
  | TallyExercise
  | SlotsExercise
  | SortExercise;

export interface LevelPlan {
  exercises: Exercise[];
  usedIds: string[]; // ítems del banco usados, para no repetirlos pronto
}

export type LevelBuilder = (
  level: LevelNumber,
  mode: Mode,
  recentIds: readonly string[]
) => LevelPlan;
