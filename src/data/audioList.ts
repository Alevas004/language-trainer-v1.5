import { GAME_RULES, BOSS_RULES, RULES_AUDIO_TEXT } from "@/data/rules";
import { MANIPULATIONS } from "@/data/phonology/manipulations";
import { MINIMAL_PAIRS } from "@/data/phonology/pairs";
import { PHRASES } from "@/data/phonology/phrases";
import { PHON_WORDS } from "@/data/phonology/words";
import { audioFileFor } from "@/utils/audioPath";

export type AudioGroup = "pares" | "palabras" | "frases" | "reglas";

export interface AudioEntry {
  text: string;
  file: string; // ruta dentro de public/audio/
  group: AudioGroup;
}

export const AUDIO_GROUP_LABELS: Record<AudioGroup, string> = {
  pares: "Pares mínimos (grabar primero con voz real)",
  palabras: "Palabras",
  frases: "Frases",
  reglas: "Reglas de los juegos",
};

// Todo lo que el juego puede leer con una grabación real. Lo que no está aquí
// (pistas, situaciones, etc.) se lee siempre con la voz del navegador.
export const buildAudioList = (): AudioEntry[] => {
  const entries = new Map<string, AudioEntry>();
  const add = (text: string, group: AudioGroup, file = audioFileFor(text)) => {
    if (!entries.has(file)) entries.set(file, { text, file, group });
  };

  MINIMAL_PAIRS.forEach((pair) => {
    add(pair.a.word, "pares");
    add(pair.b.word, "pares");
  });
  PHON_WORDS.forEach((w) => add(w.word, "palabras"));
  MANIPULATIONS.forEach((m) => {
    add(m.base.word, "palabras");
    add(m.result.word, "palabras");
  });
  PHRASES.forEach((p) => add(p.text, "frases"));
  Object.values(GAME_RULES).forEach((rules) => add(RULES_AUDIO_TEXT(rules), "reglas", rules.audio));
  add(RULES_AUDIO_TEXT(BOSS_RULES), "reglas", BOSS_RULES.audio);

  return [...entries.values()];
};
