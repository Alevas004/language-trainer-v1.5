import { isSupport, optionCount, pickOne } from "@/data/common";
import type { LevelNumber, Mode } from "@/types";
import type {
  ChoiceExercise,
  ChoiceOption,
  Exercise,
  LevelBuilder,
  LevelPlan,
  TallyExercise,
} from "@/types/exercises";
import { pickRandom, shuffle } from "@/utils/pickRandom";
import { SOUND_NAMES, type SoundKind } from "@/utils/tones";
import { MANIPULATIONS, type Manipulation } from "./manipulations";
import { MINIMAL_PAIRS } from "./pairs";
import { PHRASES, type Phrase } from "./phrases";
import { PHON_WORDS, type PhonWord } from "./words";

// ---------- Nivel 1: conciencia léxica (contar palabras) + sonidos no verbales ----------

const soundExercise = (id: string): ChoiceExercise => {
  const kinds: SoundKind[] = ["drum", "bell", "flute"];
  const first = pickOne(kinds);
  const same = Math.random() < 0.5;
  const second = same ? first : pickOne(kinds.filter((k) => k !== first));
  return {
    kind: "choice",
    id,
    instruction: "Escucha los dos sonidos. ¿Son iguales o diferentes?",
    stimulus: { sounds: [first, second] },
    layout: "words",
    options: shuffle([
      { id: "same", text: "Iguales" },
      { id: "diff", text: "Diferentes" },
    ]),
    correct: same ? "same" : "diff",
    hints: [
      "Escucha otra vez, con mucha atención.",
      `Primero sonó el ${SOUND_NAMES[first]} y luego el ${SOUND_NAMES[second]}.`,
    ],
    success: same ? "Sonaron iguales." : "Sonaron diferentes.",
  };
};

const phraseExercise = (phrase: Phrase, id: string, support: boolean): TallyExercise => ({
  kind: "tally",
  id,
  instruction: "Escucha la frase. Pon una piedrita por cada palabra.",
  speak: phrase.text,
  stimulus: { emoji: phrase.emoji },
  target: phrase.words.length,
  unit: "palabra",
  units: support ? phrase.words : undefined,
  hints: [
    "Escucha otra vez, despacito. Cada palabra es una piedrita.",
    `Contamos juntos: ${phrase.words.join(", ")}.`,
    `La frase tiene ${phrase.words.length} palabras.`,
  ],
  success: `«${phrase.text}» tiene ${phrase.words.length} palabras.`,
});

const level1 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const counts = [2, 3, 4, 5];
  const used: string[] = [];
  const exercises: Exercise[] = [soundExercise("l1-sonidos")];
  counts.forEach((count, i) => {
    const pool = PHRASES.filter((p) => p.words.length === count || (count === 5 && p.words.length === 6));
    const [phrase] = pickRandom(pool, 1, recent);
    used.push(phrase.id);
    exercises.push(phraseExercise(phrase, `l1-${i}`, support));
  });
  return { exercises, usedIds: used };
};

// ---------- Nivel 2: segmentación silábica ----------

const syllableExercise = (word: PhonWord, id: string, support: boolean): TallyExercise => ({
  kind: "tally",
  id,
  instruction: "Escucha la palabra. Pon una piedrita por cada sílaba.",
  speak: word.word,
  stimulus: { emoji: word.emoji },
  target: word.syllables.length,
  unit: "sílaba",
  units: support ? word.syllables : undefined,
  hints: [
    `Di la palabra despacito, como si dieras palmadas: ${word.word}.`,
    `Se separa así: ${word.syllables.join(" - ")}.`,
    `«${word.word}» tiene ${word.syllables.length} sílabas.`,
  ],
  success: `${word.syllables.join(" - ")}: ${word.syllables.length} sílabas.`,
});

const level2 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const counts = [2, 2, 3, 3, 4];
  const chosen: PhonWord[] = [];
  counts.forEach((count) => {
    const pool = PHON_WORDS.filter(
      (w) => w.syllables.length === count && !chosen.includes(w)
    );
    chosen.push(pickRandom(pool, 1, recent)[0]);
  });
  return {
    exercises: chosen.map((w, i) => syllableExercise(w, `l2-${i}`, support)),
    usedIds: chosen.map((w) => w.id),
  };
};

// ---------- Nivel 3: sílabas iniciales y finales ----------

const sharedBy = (key: (w: PhonWord) => string) => {
  const groups = new Map<string, PhonWord[]>();
  for (const word of PHON_WORDS) {
    const k = key(word);
    groups.set(k, [...(groups.get(k) ?? []), word]);
  }
  return [...groups.entries()].filter(([, words]) => words.length >= 2);
};

const level3 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const count = optionCount(mode);
  const initial = sharedBy((w) => w.syllables[0]);
  const final = sharedBy((w) => w.syllables[w.syllables.length - 1]);
  const kinds: ("initial" | "final")[] = ["initial", "final", "initial", "final", "initial"];
  const used: string[] = [];
  const exercises: Exercise[] = [];

  kinds.forEach((kind, i) => {
    const groups = kind === "initial" ? initial : final;
    // No repetir palabras dentro de la misma página, y evitar las recientes
    const open = groups
      .map(([syl, ws]) => [syl, ws.filter((w) => !used.includes(w.id))] as const)
      .filter(([, ws]) => ws.length >= 2);
    const fresh = open.filter(([, ws]) => ws.some((w) => !recent.includes(w.id)));
    const [syllable, words] = pickOne(fresh.length ? fresh : open);
    const [target, match] = shuffle(words).slice(0, 2);
    const edge = (w: PhonWord) =>
      kind === "initial" ? w.word.slice(0, 2) : w.word.slice(-2);
    const distractors = shuffle(
      PHON_WORDS.filter(
        (w) =>
          w.id !== target.id &&
          w.id !== match.id &&
          w.syllables[kind === "initial" ? 0 : w.syllables.length - 1] !== syllable &&
          edge(w) !== edge(target)
      )
    ).slice(0, count - 1);

    const toOption = (w: PhonWord): ChoiceOption => ({
      id: w.id,
      emoji: w.emoji,
      text: support ? w.word : undefined,
      say: w.word,
    });
    const part = kind === "initial" ? "empieza" : "termina";
    exercises.push({
      kind: "choice",
      id: `l3-${i}`,
      instruction: `¿Qué imagen ${part} igual que «${target.word}»?`,
      speak: target.word,
      stimulus: { emoji: target.emoji },
      layout: "pictures",
      options: shuffle([match, ...distractors].map(toOption)),
      correct: match.id,
      hints: [
        kind === "initial"
          ? `Escucha el principio de «${target.word}»: ${syllable}…`
          : `Escucha el final de «${target.word}»: …${syllable}`,
        `«${target.word}» ${part} con «${syllable}». Busca otra palabra que ${part} con «${syllable}».`,
      ],
      success: `«${target.word}» y «${match.word}» ${part} con «${syllable}».`,
    });
    used.push(target.id, match.id);
  });
  return { exercises, usedIds: used };
};

// ---------- Nivel 4: discriminación de pares mínimos ----------

const level4 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const pairs = pickRandom(MINIMAL_PAIRS, 5, recent);
  const exercises: Exercise[] = pairs.map((pair, i) => {
    const targetIsA = Math.random() < 0.5;
    const target = targetIsA ? pair.a : pair.b;
    const toOption = (x: { word: string; emoji: string }): ChoiceOption => ({
      id: x.word,
      emoji: x.emoji,
      text: support ? x.word : undefined,
      say: x.word,
    });
    return {
      kind: "choice",
      id: `l4-${i}`,
      instruction: "Escucha la palabra y toca la imagen correcta.",
      speak: target.word,
      layout: "pictures",
      options: shuffle([toOption(pair.a), toOption(pair.b)]),
      correct: target.word,
      hints: [
        "Escucha otra vez. Las dos palabras suenan casi igual.",
        `Escucha las dos con calma: ${pair.a.word}… ${pair.b.word}. Cambia un solo sonido.`,
      ],
      success: `Era «${target.word}».`,
    };
  });
  return { exercises, usedIds: pairs.map((p) => p.id) };
};

// ---------- Nivel 5: manipulación de fonemas ----------

const manipulationPrompt = (m: Manipulation): { instruction: string; speak: string } => {
  if (m.type === "omit") {
    return {
      instruction: `Quita el sonido «${m.sound}» de «${m.base.word}». ¿Qué palabra queda?`,
      speak: `Quita el sonido ${m.sound} de la palabra ${m.base.word}.`,
    };
  }
  if (m.type === "add") {
    return {
      instruction: `Añade el sonido «${m.sound}» a «${m.base.word}». ¿Qué palabra sale?`,
      speak: `Añade el sonido ${m.sound} a la palabra ${m.base.word}.`,
    };
  }
  return {
    instruction: `En «${m.base.word}», cambia «${m.sound}» por «${m.to}». ¿Qué palabra sale?`,
    speak: `En la palabra ${m.base.word}, cambia ${m.sound} por ${m.to}.`,
  };
};

const level5 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const count = optionCount(mode);
  const items = pickRandom(MANIPULATIONS, 5, recent);
  const exercises: Exercise[] = items.map((m, i) => {
    const { instruction, speak } = manipulationPrompt(m);
    const extras = shuffle(
      PHON_WORDS.filter(
        (w) =>
          w.word !== m.result.word &&
          w.word !== m.base.word &&
          w.emoji !== m.result.emoji &&
          w.emoji !== m.base.emoji
      )
    )
      .slice(0, count - 2)
      .map((w) => ({ word: w.word, emoji: w.emoji }));
    const options = [m.result, m.base, ...extras].map(
      (x): ChoiceOption => ({
        id: x.word,
        emoji: x.emoji,
        text: support ? x.word : undefined,
        say: x.word,
      })
    );
    return {
      kind: "choice",
      id: `l5-${i}`,
      instruction,
      speak,
      stimulus: { emoji: m.base.emoji },
      layout: "pictures",
      options: shuffle(options),
      correct: m.result.word,
      hints: [
        `Di «${m.base.word}» despacito y haz el cambio con tu voz.`,
        `El resultado suena así: ${m.result.word}.`,
      ],
      success: `«${m.base.word}» cambia a «${m.result.word}».`,
    };
  });
  return { exercises, usedIds: items.map((m) => m.id) };
};

export const buildPhonologyLevel: LevelBuilder = (
  level: LevelNumber,
  mode: Mode,
  recent: readonly string[]
): LevelPlan => {
  switch (level) {
    case 1:
      return level1(mode, recent);
    case 2:
      return level2(mode, recent);
    case 3:
      return level3(mode, recent);
    case 4:
      return level4(mode, recent);
    default:
      return level5(mode, recent);
  }
};
