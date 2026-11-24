import type { SubcomponentId } from "@/types";

export interface GameRules {
  intro: string; // una frase que pone en situación
  lines: string[]; // reglas cortas, una idea por línea
  audio: string; // grabación real opcional, dentro de public/audio/
}

// Reglas breves y con frases completas, para que sirvan también de modelo
export const GAME_RULES: Record<SubcomponentId, GameRules> = {
  phonology: {
    intro: "El viento se llevó los sonidos del libro. Vamos a atraparlos.",
    lines: [
      "Escucha con atención lo que dice Señor Loro.",
      "Toca o arrastra con tu varita para responder.",
      "Si necesitas ayuda, toca a Señor Loro.",
      "Cada página que termines llena el libro.",
    ],
    audio: "frases/reglas-phonology.mp3",
  },
  morphosyntax: {
    intro: "Las frases se desordenaron en el taller. Vamos a armarlas otra vez.",
    lines: [
      "Mira las palabras y las imágenes.",
      "Arrastra las palabras para armar la frase.",
      "Si necesitas ayuda, toca a Señor Loro.",
      "Cada página que termines llena el libro.",
    ],
    audio: "frases/reglas-morphosyntax.mp3",
  },
  lexicon: {
    intro: "Las palabras se escaparon del jardín. Vamos a encontrarlas.",
    lines: [
      "Mira las imágenes y escucha las pistas.",
      "Toca la palabra o el grupo que corresponde.",
      "Si necesitas ayuda, toca a Señor Loro.",
      "Cada página que termines llena el libro.",
    ],
    audio: "frases/reglas-lexicon.mp3",
  },
  pragmatics: {
    intro: "En la plaza, cada personaje habla a su manera. Vamos a conversar con ellos.",
    lines: [
      "Escucha lo que dice cada personaje y mira su cara.",
      "Elige qué responderle.",
      "Si necesitas ayuda, toca a Señor Loro.",
      "Cada página que termines llena el libro.",
    ],
    audio: "frases/reglas-pragmatics.mp3",
  },
};

export const RULES_AUDIO_TEXT = (rules: GameRules): string =>
  `${rules.intro} ${rules.lines.join(" ")}`;

// Reglas del boss (La Gran Página)
export const BOSS_RULES: GameRules = {
  intro: "La Gran Página reúne todo lo que aprendiste. Cada reto devuelve una palabra al libro.",
  lines: [
    "Habrá retos de sonidos, frases, palabras y conversaciones.",
    "Tómate tu tiempo: no hay vidas ni prisa.",
    "Si necesitas ayuda, toca a Señor Loro.",
    "Al terminar, el libro quedará completo.",
  ],
  audio: "frases/reglas-boss.mp3",
};
