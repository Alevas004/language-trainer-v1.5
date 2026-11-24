import { capitalize, isSupport, optionCount, pickOne } from "@/data/common";
import type { LevelNumber, Mode } from "@/types";
import type {
  ChoiceExercise,
  ChoiceOption,
  Exercise,
  LevelBuilder,
  LevelPlan,
  SortExercise,
} from "@/types/exercises";
import { pickRandom, shuffle } from "@/utils/pickRandom";
import { CATEGORIES, LEX_ITEMS, type Category, type LexItem } from "./items";
import { ANALOGIES, POLYSEMY, RELATIONS, type WordRelation } from "./relations";

const categoryOf = (id: string): Category => CATEGORIES.find((c) => c.id === id)!;
const itemsOf = (category: string) => LEX_ITEMS.filter((i) => i.category === category);

const optionOf = (item: LexItem, showText: boolean): ChoiceOption => ({
  id: item.id,
  emoji: item.emoji,
  text: showText ? item.word : undefined,
});

// ---------- Nivel 1: campos semánticos (clasificar) ----------

const sortExercise = (
  id: string,
  groupCount: number,
  perGroup: number,
  recent: readonly string[],
  used: string[]
): SortExercise => {
  const available = (c: Category) =>
    itemsOf(c.id).filter((i) => !used.includes(i.id)).length;
  const categories = shuffle(CATEGORIES.filter((c) => available(c) >= perGroup)).slice(
    0,
    groupCount
  );
  const items = categories.flatMap((c) => {
    const picked = pickRandom(
      itemsOf(c.id).filter((i) => !used.includes(i.id)),
      perGroup,
      recent
    );
    return picked.map((i) => ({ id: i.id, emoji: i.emoji, label: i.word, group: c.id }));
  });
  used.push(...items.map((i) => i.id));
  const names = categories.map((c) => c.group);
  return {
    kind: "sort",
    id,
    instruction: "Lleva cada imagen a su grupo.",
    groups: categories.map((c) => ({ id: c.id, label: c.group, emoji: c.emoji })),
    items: shuffle(items),
    hints: [
      "Mira las imágenes y piensa qué tienen en común.",
      `Hay un grupo de «${names[0]}» y otro de «${names[1]}».`,
    ],
    success: `Muy bien: ${names.join(" y ")}.`,
  };
};

const level1 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const used: string[] = [];
  const plans: [number, number][] = isSupport(mode)
    ? [[2, 2], [2, 2], [2, 2], [2, 2], [2, 2]]
    : [[2, 2], [2, 2], [2, 3], [2, 3], [3, 2]];
  const exercises = plans.map(([groups, per], i) =>
    sortExercise(`x1-${i}`, groups, per, recent, used)
  );
  return { exercises, usedIds: used };
};

// ---------- Nivel 2: veo veo (evocación con pistas) ----------

const level2 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const count = optionCount(mode);
  const targets = pickRandom(LEX_ITEMS, 5, recent);
  const exercises: Exercise[] = targets.map((target, i): ChoiceExercise => {
    const category = categoryOf(target.category);
    const sameCategory = itemsOf(target.category).filter((x) => x.id !== target.id);
    const others = LEX_ITEMS.filter((x) => x.category !== target.category);
    // Las primeras pistas son más fáciles: distractores de otros grupos
    const useSame = !support && i >= 2;
    const distractors = useSame
      ? [...shuffle(sameCategory).slice(0, 2), ...shuffle(others)].slice(0, count - 1)
      : shuffle(others).slice(0, count - 1);
    const start = target.syllables[0];
    return {
      kind: "choice",
      id: `x2-${i}`,
      instruction: "Veo, veo… Piensa en la palabra y toca la imagen.",
      speak: `Veo, veo. ${target.clue}`,
      stimulus: { sentence: `«${target.clue}»` },
      layout: "pictures",
      options: shuffle([target, ...distractors].map((x) => optionOf(x, support))),
      correct: target.id,
      hints: [
        `Es ${category.singular}.`,
        `Empieza con «${start}».`,
        target.use,
        `Se dice «${target.word.slice(0, Math.ceil(target.word.length / 2))}…»`,
      ],
      success: `Era ${target.word}.`,
    };
  });
  return { exercises, usedIds: targets.map((t) => t.id) };
};

// ---------- Nivel 3: sinónimos y antónimos ----------

const relationExercise = (rel: WordRelation, id: string, mode: Mode): ChoiceExercise => {
  const synonym = rel.type === "sinonimo";
  const shown = [rel.answer, ...shuffle(rel.distractors).slice(0, optionCount(mode, 3) - 1)];
  return {
    kind: "choice",
    id,
    instruction: synonym
      ? `¿Qué palabra significa casi lo mismo que «${rel.word}»?`
      : `¿Qué palabra significa lo contrario de «${rel.word}»?`,
    stimulus: { sentence: rel.sentence },
    layout: "words",
    options: shuffle(shown).map((text) => ({ id: text, text })),
    correct: rel.answer,
    hints: [
      "Lee la frase y piensa qué quiere decir la palabra.",
      synonym
        ? "Busca una palabra que se pueda usar en la misma frase sin cambiar su sentido."
        : `Piensa en lo contrario de «${rel.word}».`,
    ],
    success: synonym
      ? `«${rel.word}» y «${rel.answer}» significan casi lo mismo.`
      : `«${rel.word}» y «${rel.answer}» son contrarios.`,
  };
};

const level3 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const syn = pickRandom(RELATIONS.filter((r) => r.type === "sinonimo"), 3, recent);
  const ant = pickRandom(RELATIONS.filter((r) => r.type === "antonimo"), 2, recent);
  const order = [syn[0], syn[1], ant[0], syn[2], ant[1]];
  return {
    exercises: order.map((r, i) => relationExercise(r, `x3-${i}`, mode)),
    usedIds: order.map((r) => r.id),
  };
};

// ---------- Nivel 4: categorías (¿cuál no pertenece?) y analogías ----------

// Grupos seguros: ningún ítem de otra categoría puede pertenecer también a ellos
const ODD_ONE_OUT_CATEGORIES = ["animales", "frutas", "ropa", "transportes", "instrumentos"];

const level4 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const used: string[] = [];
  const exercises: Exercise[] = [];

  const categories = shuffle(ODD_ONE_OUT_CATEGORIES).slice(0, 3);
  categories.forEach((categoryId, i) => {
    const category = categoryOf(categoryId);
    const members = pickRandom(itemsOf(categoryId), support ? 2 : 3, recent);
    const outsider = pickOne(LEX_ITEMS.filter((x) => x.category !== categoryId));
    used.push(...members.map((m) => m.id), outsider.id);
    exercises.push({
      kind: "choice",
      id: `x4-${i}`,
      instruction: `¿Cuál NO es ${category.singular}?`,
      layout: "pictures",
      options: shuffle([...members, outsider].map((x) => optionOf(x, support))),
      correct: outsider.id,
      hints: [
        "Mira las imágenes. Casi todas se parecen en algo.",
        `Busca la que no es ${category.singular}.`,
      ],
      success: `${capitalize(outsider.word)} no es ${category.singular}.`,
    });
  });

  const analogies = pickRandom(ANALOGIES, 2, recent);
  analogies.forEach((an, i) => {
    const shown = [an.answer, ...shuffle(an.distractors).slice(0, optionCount(mode, 3) - 1)];
    exercises.push({
      kind: "choice",
      id: `x4-a${i}`,
      instruction: "Completa la analogía.",
      stimulus: { sentence: `${capitalize(an.a)} es a ${an.b} como ${an.c} es a ___.` },
      layout: "words",
      options: shuffle(shown).map((text) => ({ id: text, text })),
      correct: an.answer,
      hints: [
        "Piensa cómo se relacionan las dos primeras palabras.",
        `«${an.a}» y «${an.b}» van juntas. Busca algo que vaya con «${an.c}» de la misma manera.`,
      ],
      success: `${capitalize(an.a)} es a ${an.b} como ${an.c} es a ${an.answer}.`,
    });
  });
  return { exercises: shuffle(exercises), usedIds: [...used, ...analogies.map((a) => a.id)] };
};

// ---------- Nivel 5: polisemia y homonimia en contexto visual ----------

const level5 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const support = isSupport(mode);
  const words = pickRandom(POLYSEMY, 5, recent);
  const exercises: Exercise[] = words.map((poly, i) => {
    const sense = pickOne(poly.senses);
    const other = poly.senses.find((s) => s !== sense)!;
    const taken = poly.senses.map((x) => x.label);
    const takenEmoji = poly.senses.map((x) => x.emoji);
    const extra = pickOne(
      POLYSEMY.filter((p) => p.id !== poly.id)
        .flatMap((p) => p.senses)
        .filter((x) => !taken.includes(x.label) && !takenEmoji.includes(x.emoji))
    );
    const shown = [sense, other, ...(support ? [] : [extra])];
    return {
      kind: "choice",
      id: `x5-${i}`,
      instruction: `En esta frase, ¿qué quiere decir «${poly.word}»?`,
      stimulus: { sentence: sense.sentence },
      layout: "pictures",
      options: shuffle(shown).map((s) => ({ id: s.label, emoji: s.emoji, text: s.label })),
      correct: sense.label,
      hints: [
        "Lee la frase completa. Las otras palabras ayudan.",
        `Piensa qué se hace con «${poly.word}» en esta frase.`,
      ],
      success: `Aquí «${poly.word}» es ${sense.label}.`,
    };
  });
  return { exercises, usedIds: words.map((w) => w.id) };
};

export const buildLexiconLevel: LevelBuilder = (
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
