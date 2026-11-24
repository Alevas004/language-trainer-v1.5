// Tipos base del videojuego Language Trainer

/** Los tres componentes del lenguaje */
export type ComponentId = "form" | "content" | "use";

/** Los cuatro subcomponentes: cada uno tiene su videojuego */
export type SubcomponentId =
  | "phonology"
  | "morphosyntax"
  | "lexicon"
  | "pragmatics";

/** Pantallas de la aplicación (se controlan con estado, sin enrutador) */
export type Screen = "teacher" | SubcomponentId | "boss";

/** Modo de juego: normal o nivelación ("con ayuda extra") */
export type Mode = "normal" | "support";

/** Cada juego tiene 5 niveles */
export type LevelNumber = 1 | 2 | 3 | 4 | 5;

/** Expresiones de Señor Loro, el compañero de aventura */
export type LoroExpression =
  | "happy"
  | "thinking"
  | "surprised"
  | "explaining"
  | "wink";

/** Registro de un nivel completado */
export interface LevelRecord {
  completed: boolean;
  mode: Mode; // con qué modo se completó (ambos valen igual)
  hintsUsed: number; // información orientativa para el docente
  completedAt: string; // fecha ISO
}

export type GameProgress = Partial<Record<LevelNumber, LevelRecord>>;

/** Todo lo que se guarda en localStorage como progreso */
export interface ProgressData {
  version: 1;
  profileName: string; // un grupo de clase ("3.° B") o un niño
  games: Record<SubcomponentId, GameProgress>;
  bossUnlockedByTeacher: boolean;
  bossCompleted: boolean;
  /** Últimos ítems usados por juego, para no repetirlos en la siguiente partida */
  recentItems: Record<SubcomponentId, string[]>;
}

/** Ajustes del panel del docente */
export interface Settings {
  volume: number; // 0 a 1
  speechRate: number; // 0.5 a 1.2 (velocidad de la voz)
  textScale: number; // 1 = normal
  timerEnabled: boolean; // temporizador opcional, apagado por defecto
  timerSeconds: number;
  fixedMode: Mode | null; // si el docente fija un modo para todos los juegos
  wandEnabled: boolean; // varita como cursor (si no, cursor normal)
}
