import { capitalize, isSupport, optionCount, pickOne } from "@/data/common";
import type { LevelNumber, Mode } from "@/types";
import type {
  ChoiceExercise,
  Exercise,
  LevelBuilder,
  LevelPlan,
  SlotsExercise,
  TemplatePart,
  Token,
} from "@/types/exercises";
import { pickRandom, shuffle } from "@/utils/pickRandom";
import { GENDER_PAIRS, NOUNS, type GenderPair, type NounForms } from "./agreement";
import {
  ARTICLES_DEFINITE,
  ARTICLES_INDEFINITE,
  SENTENCES,
  isArticle,
  isPreposition,
  normalizeWord,
  type Sentence,
} from "./sentences";
import { CONNECTORS, STORIES, TENSES, type Story } from "./story";

// Mezcla garantizando que las piezas no queden ya en el orden correcto
const shuffledNotSame = <T,>(items: T[]): T[] => {
  const result = shuffle(items);
  const sameOrder = items.length > 1 && result.every((x, i) => x === items[i]);
  return sameOrder ? [...items].reverse() : result;
};

// ---------- Nivel 1: ordenar palabras ----------

const orderExercise = (sentence: Sentence, id: string, support: boolean): SlotsExercise => {
  const values = sentence.words.map(normalizeWord);
  const tokens: Token[] = values.map((value, i) => ({ id: `${id}-t${i}`, value, text: value }));
  const prefilledCount = support ? 1 : 0;
  const prefilled = tokens.slice(0, prefilledCount);
  const bank = shuffledNotSame(tokens.slice(prefilledCount));
  return {
    kind: "slots",
    id,
    instruction: "Ordena las palabras para armar la frase.",
    speak: support ? sentence.text : undefined,
    stimulus: { emoji: sentence.emoji },
    template: values.map((_, i): TemplatePart => ({ slot: i })),
    answers: values,
    bank,
    prefilled: prefilled.length ? prefilled : undefined,
    tokenLayout: "words",
    hints: [
      "Mira la imagen y piensa quién hace la acción.",
      `La frase empieza con «${capitalize(values[0])}».`,
      `La frase termina con «${values[values.length - 1]}».`,
    ],
    success: `${sentence.text}.`,
  };
};

const level1 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const lengths = [3, 3, 3, 4, 4];
  const chosen: Sentence[] = [];
  lengths.forEach((len) => {
    const pool = SENTENCES.filter((s) => s.words.length === len && !chosen.includes(s));
    chosen.push(pickRandom(pool, 1, recent)[0]);
  });
  return {
    exercises: chosen.map((s, i) => orderExercise(s, `m1-${i}`, support)),
    usedIds: chosen.map((s) => s.id),
  };
};

// ---------- Nivel 2: género y número ----------

const NUMBER_WORDS = ["dos", "tres", "cuatro"];

const numberExercise = (noun: NounForms, id: string, mode: Mode): ChoiceExercise => {
  const plural = Math.random() < 0.5;
  const count = plural ? NUMBER_WORDS[Math.floor(Math.random() * 3)] : (noun.gender === "m" ? "un" : "una");
  const quantity = plural ? NUMBER_WORDS.indexOf(count) + 2 : 1;
  const correct = plural ? noun.plural : noun.singular;
  const opposite = plural ? noun.singular : noun.plural;
  const other = pickOne(NOUNS.filter((x) => x.id !== noun.id));
  const options = [correct, opposite];
  if (!isSupport(mode)) options.push(plural ? other.plural : other.singular);
  return {
    kind: "choice",
    id,
    instruction: "Mira la imagen y completa la frase.",
    stimulus: { emoji: noun.emoji, emojiRepeat: quantity, sentence: `Hay ${count} ___.` },
    layout: "words",
    options: shuffle(options).map((text) => ({ id: text, text })),
    correct,
    hints: [
      "Cuenta cuántos hay en la imagen.",
      "Si hay uno, la palabra queda en singular. Si hay varios, cambia al final.",
    ],
    success: `Hay ${count} ${correct}.`,
  };
};

const genderExercise = (pair: GenderPair, id: string, mode: Mode): ChoiceExercise => {
  const askFemale = Math.random() < 0.5;
  const correct = askFemale ? pair.female : pair.male;
  const sentence = askFemale
    ? `El ${pair.male} y la ___.`
    : `La ${pair.female} y el ___.`;
  const options = [correct, askFemale ? pair.male : pair.female];
  if (!isSupport(mode)) options.push(askFemale ? pair.femalePlural : pair.malePlural);
  return {
    kind: "choice",
    id,
    instruction: "Completa la frase con la palabra correcta.",
    stimulus: { emoji: pair.emoji[askFemale ? 1 : 0], sentence },
    layout: "words",
    options: shuffle(options).map((text) => ({ id: text, text })),
    correct,
    hints: [
      "Mira la palabra que está antes del hueco.",
      "Con «la» decimos niña, gata, abuela… Con «el» decimos niño, gato, abuelo…",
    ],
    success: sentence.replace("___", correct),
  };
};

const level2 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const nouns = pickRandom(NOUNS, 3, recent);
  const pairs = pickRandom(GENDER_PAIRS, 2, recent);
  const exercises: Exercise[] = [
    numberExercise(nouns[0], "m2-0", mode),
    genderExercise(pairs[0], "m2-1", mode),
    numberExercise(nouns[1], "m2-2", mode),
    genderExercise(pairs[1], "m2-3", mode),
    numberExercise(nouns[2], "m2-4", mode),
  ];
  return { exercises, usedIds: [...nouns.map((n) => n.id), ...pairs.map((p) => p.id)] };
};

// ---------- Nivel 3: palabras de función (una a la vez) ----------

interface Blank {
  index: number;
  answer: string;
  distractors: string[];
}

const articleDistractors = (answer: string): string[] => {
  const family = ARTICLES_DEFINITE.includes(answer) ? ARTICLES_DEFINITE : ARTICLES_INDEFINITE;
  return family.filter((a) => a !== answer);
};

// Palabras que se pueden quitar sin dejar dos respuestas posibles
const blanksOf = (sentence: Sentence): Blank[] => {
  const blanks: Blank[] = [];
  let prepSeen = false;
  sentence.words.forEach((raw, index) => {
    const word = raw.toLowerCase();
    if (isArticle(word)) {
      blanks.push({ index, answer: word, distractors: articleDistractors(word) });
    } else if (isPreposition(word) && !prepSeen && sentence.prepDistractors.length) {
      prepSeen = true;
      blanks.push({ index, answer: word, distractors: sentence.prepDistractors });
    }
  });
  return blanks;
};

const functionExercise = (sentence: Sentence, id: string, mode: Mode): ChoiceExercise => {
  const blank = pickOne(blanksOf(sentence));
  const count = optionCount(mode);
  const cap = (w: string) => (blank.index === 0 ? capitalize(w) : w);
  const words = sentence.words.map((w, i) => (i === blank.index ? "___" : w));
  const options = [blank.answer, ...shuffle(blank.distractors).slice(0, count - 1)];
  return {
    kind: "choice",
    id,
    instruction: "Completa la frase con la palabra que falta.",
    stimulus: { emoji: sentence.emoji, sentence: `${words.join(" ")}.` },
    layout: "words",
    options: shuffle(options).map((text) => ({ id: text, text: cap(text) })),
    correct: blank.answer,
    hints: [
      "Lee la frase y piensa qué palabra falta.",
      "Prueba cada palabra y escucha cómo suena la frase completa.",
      `Falta «${cap(blank.answer)}»: ${sentence.text}.`,
    ],
    success: `${sentence.text}.`,
  };
};

const level3 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const pool = SENTENCES.filter((s) => s.words.length >= 5 && blanksOf(s).length > 0);
  const chosen = pickRandom(pool, 5, recent);
  return {
    exercises: chosen.map((s, i) => functionExercise(s, `m3-${i}`, mode)),
    usedIds: chosen.map((s) => s.id),
  };
};

// ---------- Nivel 4: ampliar frases telegráficas ----------

// Oraciones donde todas las palabras de función se pueden quitar sin ambigüedad
const expandable = (s: Sentence): Blank[] | null => {
  const blanks = blanksOf(s);
  const lower = s.words.map((w) => w.toLowerCase());
  const functionWords = lower.filter((w) => isArticle(w) || isPreposition(w) || w === "y");
  const hasBoth =
    blanks.some((b) => ARTICLES_DEFINITE.includes(b.answer)) &&
    blanks.some((b) => ARTICLES_INDEFINITE.includes(b.answer));
  if (blanks.length < 2 || blanks.length > 3) return null;
  if (functionWords.length !== blanks.length || hasBoth) return null;
  return blanks;
};

const expandExercise = (sentence: Sentence, blanks: Blank[], id: string, mode: Mode): SlotsExercise => {
  const blankIndexes = blanks.map((b) => b.index);
  const template: TemplatePart[] = [];
  const answers: string[] = [];
  sentence.words.forEach((word, i) => {
    if (blankIndexes.includes(i)) {
      template.push({ slot: answers.length });
      answers.push(blanks.find((b) => b.index === i)!.answer);
    } else {
      template.push({ text: i === 0 ? word : normalizeWord(word) });
    }
  });
  const telegraphic = sentence.words
    .filter((_, i) => !blankIndexes.includes(i))
    .map(normalizeWord)
    .join(" ");
  // Piezas de más: solo artículos que no encajan en ningún hueco
  const articlesUsed = answers.filter(isArticle);
  const extraPool = [
    ...(articlesUsed.some((a) => ARTICLES_DEFINITE.includes(a)) ? ARTICLES_DEFINITE : ARTICLES_INDEFINITE),
  ].filter((a) => !answers.includes(a));
  const extras = isSupport(mode) ? [] : shuffle(extraPool).slice(0, 1);
  const tokens: Token[] = [...answers, ...extras].map((value, i) => ({
    id: `${id}-t${i}`,
    value,
    text: value,
  }));
  const prefilled = isSupport(mode) ? tokens.slice(0, 1) : [];
  const bank = shuffledNotSame(tokens.slice(prefilled.length));
  return {
    kind: "slots",
    id,
    instruction: "A esta frase le faltan palabras pequeñas. Complétala.",
    stimulus: { emoji: sentence.emoji, sentence: `${capitalize(telegraphic)}.` },
    template,
    answers,
    bank,
    prefilled: prefilled.length ? prefilled : undefined,
    tokenLayout: "words",
    hints: [
      "Le faltan palabras pequeñas, como «el», «la» o «en».",
      `Así suena la frase completa: «${sentence.text}».`,
    ],
    success: `${sentence.text}.`,
  };
};

const level4 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const candidates = SENTENCES.map((s) => ({ s, blanks: expandable(s) })).filter(
    (x): x is { s: Sentence; blanks: Blank[] } =>
      x.blanks !== null && (!support || x.blanks.length === 2)
  );
  const chosen = pickRandom(candidates.map((c) => c.s), 5, recent);
  return {
    exercises: chosen.map((s, i) =>
      expandExercise(s, candidates.find((c) => c.s === s)!.blanks, `m4-${i}`, mode)
    ),
    usedIds: chosen.map((s) => s.id),
  };
};

// ---------- Nivel 5: historietas, conectores y tiempos verbales ----------

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

const storyExercise = (story: Story, id: string, support: boolean): SlotsExercise => {
  const tokens: Token[] = story.steps.map((step, i) => ({
    id: `${id}-t${i}`,
    value: `p${i}`,
    emoji: step.emoji,
    caption: step.text,
  }));
  const prefilled = support ? tokens.slice(0, 1) : [];
  return {
    kind: "slots",
    id,
    instruction: "Ordena la historia: ¿qué pasó primero, luego y al final?",
    template: [0, 1, 2].map((slot): TemplatePart => ({ slot })),
    slotLabels: ["Primero", "Luego", "Al final"],
    answers: ["p0", "p1", "p2"],
    bank: shuffledNotSame(tokens.slice(prefilled.length)),
    prefilled: prefilled.length ? prefilled : undefined,
    tokenLayout: "cards",
    hints: [
      "Mira las imágenes. ¿Qué tiene que pasar antes?",
      `Primero: «${story.steps[0].text}».`,
    ],
    success: `Primero ${lowerFirst(story.steps[0].text)}, luego ${lowerFirst(story.steps[1].text)} y al final ${lowerFirst(story.steps[2].text)}.`,
  };
};

const wordsExercise = (
  id: string,
  sentence: string,
  answer: string,
  options: string[],
  instruction: string,
  hints: string[],
  mode: Mode
): ChoiceExercise => {
  const wrong = options.filter((o) => o !== answer);
  const shown = [answer, ...shuffle(wrong).slice(0, optionCount(mode, 3) - 1)];
  return {
    kind: "choice",
    id,
    instruction,
    stimulus: { sentence },
    layout: "words",
    options: shuffle(shown).map((text) => ({ id: text, text })),
    correct: answer,
    hints,
    success: sentence.replace("___", answer),
  };
};

const level5 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const stories = pickRandom(STORIES, 2, recent);
  const connectors = pickRandom(CONNECTORS, 2, recent);
  const [tense] = pickRandom(TENSES, 1, recent);
  const connectorHints = [
    "Lee la frase. ¿Una cosa pasa por causa de otra, o son dos ideas distintas?",
    "Prueba cada palabra y escucha si la frase tiene sentido.",
  ];
  const exercises: Exercise[] = [
    storyExercise(stories[0], "m5-0", support),
    wordsExercise("m5-1", connectors[0].sentence, connectors[0].answer, connectors[0].options,
      "Elige la palabra que une las dos ideas.", connectorHints, mode),
    storyExercise(stories[1], "m5-2", support),
    wordsExercise("m5-3", connectors[1].sentence, connectors[1].answer, connectors[1].options,
      "Elige la palabra que une las dos ideas.", connectorHints, mode),
    wordsExercise("m5-4", tense.sentence, tense.answer, tense.options,
      "Elige la palabra que va con el tiempo de la frase.",
      ["Fíjate en la primera palabra: ayer, ahora o mañana.", "Ayer ya pasó, ahora está pasando y mañana todavía no ha pasado."], mode),
  ];
  return {
    exercises,
    usedIds: [...stories.map((s) => s.id), ...connectors.map((c) => c.id), tense.id],
  };
};

export const buildMorphosyntaxLevel: LevelBuilder = (
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
