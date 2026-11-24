import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LEVELS,
  LEVELS_ARE_SEQUENTIAL,
  SUBCOMPONENT_IDS,
} from "@/data/structure";
import type { LevelNumber, Mode, ProgressData, SubcomponentId } from "@/types";
import { PROGRESS_KEY, loadJSON, removeKey, saveJSON } from "@/utils/storage";

const MAX_RECENT_ITEMS = 20;

export interface ProgressContextValue {
  progress: ProgressData;
  /** Cuántos niveles (0 a 5) lleva completados un juego */
  completedCount: (game: SubcomponentId) => number;
  isLevelCompleted: (game: SubcomponentId, level: LevelNumber) => boolean;
  isLevelUnlocked: (game: SubcomponentId, level: LevelNumber) => boolean;
  isGameComplete: (game: SubcomponentId) => boolean;
  allGamesComplete: boolean;
  /** El boss se abre al completar los 4 juegos o si el docente lo desbloquea */
  bossUnlocked: boolean;
  completeLevel: (
    game: SubcomponentId,
    level: LevelNumber,
    mode: Mode,
    hintsUsed?: number
  ) => void;
  setProfileName: (name: string) => void;
  setBossUnlockedByTeacher: (value: boolean) => void;
  markBossCompleted: () => void;
  rememberItems: (game: SubcomponentId, ids: string[]) => void;
  resetAll: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

const createInitialProgress = (): ProgressData => ({
  version: 1,
  profileName: "",
  games: { phonology: {}, morphosyntax: {}, lexicon: {}, pragmatics: {} },
  bossUnlockedByTeacher: false,
  bossCompleted: false,
  recentItems: { phonology: [], morphosyntax: [], lexicon: [], pragmatics: [] },
});

const loadProgress = (): ProgressData => {
  const initial = createInitialProgress();
  const saved = loadJSON<Partial<ProgressData> | null>(PROGRESS_KEY, null);
  if (!saved || saved.version !== 1) return initial;
  return {
    ...initial,
    ...saved,
    games: { ...initial.games, ...saved.games },
    recentItems: { ...initial.recentItems, ...saved.recentItems },
  };
};

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    saveJSON(PROGRESS_KEY, progress);
  }, [progress]);

  const completeLevel = useCallback(
    (
      game: SubcomponentId,
      level: LevelNumber,
      mode: Mode,
      hintsUsed: number = 0
    ) => {
      setProgress((prev) => {
        if (prev.games[game][level]?.completed) return prev; // ya estaba hecho
        return {
          ...prev,
          games: {
            ...prev.games,
            [game]: {
              ...prev.games[game],
              [level]: {
                completed: true,
                mode,
                hintsUsed,
                completedAt: new Date().toISOString(),
              },
            },
          },
        };
      });
    },
    []
  );

  const setProfileName = useCallback((name: string) => {
    setProgress((prev) => ({ ...prev, profileName: name }));
  }, []);

  const setBossUnlockedByTeacher = useCallback((value: boolean) => {
    setProgress((prev) => ({ ...prev, bossUnlockedByTeacher: value }));
  }, []);

  const markBossCompleted = useCallback(() => {
    setProgress((prev) => ({ ...prev, bossCompleted: true }));
  }, []);

  const rememberItems = useCallback((game: SubcomponentId, ids: string[]) => {
    setProgress((prev) => ({
      ...prev,
      recentItems: {
        ...prev.recentItems,
        [game]: [
          ...prev.recentItems[game].filter((id) => !ids.includes(id)),
          ...ids,
        ].slice(-MAX_RECENT_ITEMS),
      },
    }));
  }, []);

  const resetAll = useCallback(() => {
    removeKey(PROGRESS_KEY);
    setProgress(createInitialProgress());
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    const isLevelCompleted = (game: SubcomponentId, level: LevelNumber) =>
      progress.games[game][level]?.completed === true;

    const completedCount = (game: SubcomponentId) =>
      LEVELS.filter((level) => isLevelCompleted(game, level)).length;

    const isGameComplete = (game: SubcomponentId) =>
      completedCount(game) === LEVELS.length;

    const isLevelUnlocked = (game: SubcomponentId, level: LevelNumber) =>
      !LEVELS_ARE_SEQUENTIAL ||
      level === 1 ||
      isLevelCompleted(game, (level - 1) as LevelNumber);

    const allGamesComplete = SUBCOMPONENT_IDS.every(isGameComplete);

    return {
      progress,
      completedCount,
      isLevelCompleted,
      isLevelUnlocked,
      isGameComplete,
      allGamesComplete,
      bossUnlocked: allGamesComplete || progress.bossUnlockedByTeacher,
      completeLevel,
      setProfileName,
      setBossUnlockedByTeacher,
      markBossCompleted,
      rememberItems,
      resetAll,
    };
  }, [
    progress,
    completeLevel,
    setProfileName,
    setBossUnlockedByTeacher,
    markBossCompleted,
    rememberItems,
    resetAll,
  ]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
