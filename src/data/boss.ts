import { pickOne } from "@/data/common";
import { buildLexiconLevel } from "@/data/lexicon/levels";
import { buildMorphosyntaxLevel } from "@/data/morphosyntax/levels";
import { buildPhonologyLevel } from "@/data/phonology/levels";
import { buildPragmaticsLevel } from "@/data/pragmatics/levels";
import type { LevelNumber, Mode } from "@/types";
import type { Exercise, LevelBuilder, LevelPlan } from "@/types/exercises";
import { shuffle } from "@/utils/pickRandom";

const BUILDERS: LevelBuilder[] = [
  buildPhonologyLevel,
  buildMorphosyntaxLevel,
  buildLexiconLevel,
  buildPragmaticsLevel,
];

// Nivel final: 2 retos de cada juego (de las páginas 3 y 4), mezclados
export const buildBossPlan = (mode: Mode): LevelPlan => {
  const picked: Exercise[] = BUILDERS.flatMap((build) =>
    ([3, 4] as LevelNumber[]).map((level) => pickOne(build(level, mode, []).exercises))
  );
  return {
    exercises: shuffle(picked).map((exercise, i) => ({ ...exercise, id: `boss-${i}-${exercise.id}` })),
    usedIds: [],
  };
};
