import { capitalize, optionCount, pickOne } from "@/data/common";
import type { LevelNumber, Mode } from "@/types";
import type { ChoiceExercise, Exercise, LevelBuilder, LevelPlan } from "@/types/exercises";
import { pickRandom, shuffle } from "@/utils/pickRandom";
import {
  CHARACTERS,
  DISMISSIVE,
  FIGURATIVE_ITEMS,
  INTENTS,
  INTENT_ITEMS,
  REGISTER_ITEMS,
  SITUATIONS,
  TURN_ITEMS,
  speakerOf,
  type FigurativeItem,
} from "./dialogues";

// ---------- Nivel 1: intención comunicativa ----------

const level1 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const items = pickRandom(INTENT_ITEMS, 5, recent);
  const exercises: Exercise[] = items.map((item, i): ChoiceExercise => {
    const who = CHARACTERS[item.who];
    const shown = [item.intent, ...shuffle(item.others).slice(0, optionCount(mode) - 1)];
    return {
      kind: "choice",
      id: `u1-${i}`,
      instruction: `¿Qué quiere hacer ${who.short}?`,
      speak: item.line,
      stimulus: { speaker: speakerOf(item.who, item.face), line: item.line },
      layout: "words",
      options: shuffle(shown).map((intent) => ({
        id: intent,
        text: INTENTS[intent],
        reply: `Mmm, no era eso. Escúchame otra vez.`,
      })),
      correct: item.intent,
      hints: [
        `Mira la cara de ${who.short} y escucha cómo lo dice.`,
        `Dice: «${item.line}» Piensa para qué lo dice.`,
      ],
      success: `${capitalize(who.short)} quiere ${INTENTS[item.intent].toLowerCase()}.`,
    };
  });
  return { exercises, usedIds: items.map((x) => x.id) };
};

// ---------- Nivel 2: adaptarse al interlocutor ----------

const level2 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const items = pickRandom(REGISTER_ITEMS, 5, recent);
  const exercises: Exercise[] = items.map((item, i): ChoiceExercise => {
    const who = CHARACTERS[item.listener];
    const formal = who.register === "formal";
    const otherReply = formal
      ? "Mmm, a mí me gusta que me hablen con más respeto. ¿Lo dices de otra manera?"
      : "¡Jajaja, qué serio! Somos amigas, háblame con confianza.";
    const options = [
      { id: "fits", text: item.fits },
      { id: "other", text: item.other, reply: otherReply },
      { id: "brusque", text: item.brusque, reply: "Uy, eso sonó un poco brusco. ¿Cómo lo dirías con amabilidad?" },
    ].slice(0, optionCount(mode, 3));
    // En la nivelación se muestran solo la respuesta adecuada y la brusca/otra
    const shown = mode === "support" ? [options[0], options[1]] : options;
    return {
      kind: "choice",
      id: `u2-${i}`,
      instruction: item.situation,
      stimulus: { speaker: speakerOf(item.listener, "amable") },
      layout: "sentences",
      options: shuffle(shown),
      correct: "fits",
      hints: [
        formal
          ? `${capitalize(who.short)} merece que le hables con respeto: «usted», «por favor» y «gracias».`
          : `${capitalize(who.short)} es tu amiga: puedes hablarle con confianza, pero con amabilidad.`,
        `Elige lo que le dirías a ${who.short}, no a otra persona.`,
      ],
      success: `Así se le habla a ${who.short}: «${item.fits}»`,
    };
  });
  return { exercises, usedIds: items.map((x) => x.id) };
};

// ---------- Nivel 3: situaciones cotidianas ----------

const level3 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const items = pickRandom(SITUATIONS, 5, recent);
  const exercises: Exercise[] = items.map((item, i): ChoiceExercise => {
    const who = CHARACTERS[item.who];
    const wrong = shuffle(item.wrong).slice(0, optionCount(mode, 3) - 1);
    return {
      kind: "choice",
      id: `u3-${i}`,
      instruction: `Responde a ${who.short}.`,
      speak: item.line,
      stimulus: { speaker: speakerOf(item.who, item.face), line: item.line },
      layout: "sentences",
      options: shuffle([
        { id: "good", text: item.good },
        ...wrong.map((w, k) => ({ id: `w${k}`, text: w.text, reply: w.reply })),
      ]),
      correct: "good",
      hints: [
        `Escucha bien lo que dice ${who.short}.`,
        "Elige la respuesta que tiene que ver con lo que acaban de decirte.",
      ],
      success: `Esa respuesta tiene sentido: «${item.good}»`,
    };
  });
  return { exercises, usedIds: items.map((x) => x.id) };
};

// ---------- Nivel 4: turnos y tema compartido ----------

const level4 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const items = pickRandom(TURN_ITEMS, 5, recent);
  const exercises: Exercise[] = items.map((item, i): ChoiceExercise => {
    const who = CHARACTERS[item.who];
    const options = [
      { id: "good", text: item.good },
      {
        id: "jump",
        text: item.jump,
        reply: "¿Eh? Estábamos hablando de otra cosa… ¿puedes seguir con el tema?",
      },
    ];
    if (mode !== "support") {
      const rude = pickOne(DISMISSIVE);
      options.push({ id: "rude", text: rude.text, reply: rude.reply } as (typeof options)[number]);
    }
    return {
      kind: "choice",
      id: `u4-${i}`,
      instruction: "Sigue la conversación hablando del mismo tema.",
      speak: item.line,
      stimulus: { speaker: speakerOf(item.who, item.face), line: item.line },
      layout: "sentences",
      options: shuffle(options),
      correct: "good",
      hints: [
        `${capitalize(who.short)} está hablando de algo. ¿De qué?`,
        "Elige la frase que sigue hablando de eso y le hace una pregunta.",
      ],
      success: `Así se sigue una conversación: «${item.good}»`,
    };
  });
  return { exercises, usedIds: items.map((x) => x.id) };
};

// ---------- Nivel 5: frases hechas y sentido figurado ----------

const figurativeExercise = (item: FigurativeItem, id: string, mode: Mode): ChoiceExercise => {
  const who = CHARACTERS[item.who];
  const explain = `Esa es una frase hecha. «${item.phrase}» en realidad quiere decir: ${item.real}`;
  const options = [
    { id: "real", emoji: item.emojis.real, text: item.real },
    { id: "literal", emoji: item.emojis.literal, text: item.literal, explain },
  ];
  if (mode !== "support") {
    options.push({
      id: "extra",
      emoji: item.emojis.extra,
      text: item.extra,
      explain: `Mmm, no tiene que ver. ${explain}`,
    } as (typeof options)[number]);
  }
  return {
    kind: "choice",
    id,
    instruction: `¿Qué quiere decir ${who.short}?`,
    speak: item.phrase,
    stimulus: { speaker: speakerOf(item.who, item.face), line: item.phrase },
    layout: "pictures",
    options: shuffle(options),
    correct: "real",
    hints: [
      "A veces decimos una cosa y queremos decir otra. Piensa en lo que quiere decir de verdad.",
      "Mira la cara de quien habla. ¿Está de verdad sentado en una nube, o quiere decir otra cosa?",
    ],
    success: `Eso es: «${item.phrase}» quiere decir ${item.real.charAt(0).toLowerCase()}${item.real.slice(1)}`,
  };
};

const level5 = (mode: Mode, recent: readonly string[]): LevelPlan => {
  const items = pickRandom(FIGURATIVE_ITEMS, 5, recent);
  return {
    exercises: items.map((item, i) => figurativeExercise(item, `u5-${i}`, mode)),
    usedIds: items.map((x) => x.id),
  };
};

export const buildPragmaticsLevel: LevelBuilder = (
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
