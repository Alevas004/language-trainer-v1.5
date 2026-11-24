import { useCallback, useRef, useState } from "react";
import LevelRunner, { type LoroState } from "@/components/exercises/LevelRunner";
import { GAME_RULES } from "@/data/rules";
import { SUBCOMPONENTS } from "@/data/structure";
import { useProgress } from "@/hook/useProgress";
import GameLayout from "@/layouts/GameLayout";
import type { LevelNumber, LoroExpression, Mode, SubcomponentId } from "@/types";
import type { LevelBuilder, LevelPlan } from "@/types/exercises";
import LevelSelect from "./LevelSelect";
import RulesContent from "./RulesContent";
import RulesScreen from "./RulesScreen";

type Phase = "rules" | "levels" | "level";

interface GameShellProps {
  game: SubcomponentId;
  build: LevelBuilder;
  onExit: () => void; // vuelve a la portada
  onHome: () => void;
}

const HELP_TEXT =
  "Toca o arrastra con tu varita. Si no sabes qué hacer, pídeme una pista y lo pensamos juntos.";

// Recorrido común de cada juego: reglas -> páginas (niveles) -> ejercicios.
// Cada juego solo aporta su generador de ejercicios (build).
const GameShell = ({ game, build, onExit, onHome }: GameShellProps) => {
  const [phase, setPhase] = useState<Phase>("rules");
  const [mode, setMode] = useState<Mode>("normal");
  const [level, setLevel] = useState<LevelNumber>(1);
  const [plan, setPlan] = useState<LevelPlan | null>(null);
  const [loro, setLoro] = useState<LoroState | null>(null);
  const [runId, setRunId] = useState(0);
  const helpRef = useRef<(() => void) | null>(null);
  const { completeLevel, progress, rememberItems } = useProgress();

  const info = SUBCOMPONENTS.find((s) => s.id === game);
  const rules = GAME_RULES[game];

  const registerHelp = useCallback((handler: (() => void) | null) => {
    helpRef.current = handler;
  }, []);

  const startLevel = (selected: LevelNumber) => {
    const nextPlan = build(selected, mode, progress.recentItems[game]);
    rememberItems(game, nextPlan.usedIds);
    setLevel(selected);
    setPlan(nextPlan);
    setRunId((n) => n + 1);
    setLoro(null);
    setPhase("level");
  };

  const handleBack = () => {
    setLoro(null);
    if (phase === "level") setPhase("levels");
    else if (phase === "levels") setPhase("rules");
    else onExit();
  };

  const handleFinish = (hintsUsed: number) => {
    completeLevel(game, level, mode, hintsUsed);
    setLoro(null);
    setPhase("levels");
  };

  const defaultExpression: LoroExpression =
    phase === "rules" ? "explaining" : phase === "levels" ? "happy" : "thinking";

  const defaultMessage =
    phase === "rules"
      ? "Hola, soy Señor Loro. Te cuento cómo se juega."
      : phase === "levels"
        ? "Elige una página del libro."
        : undefined;

  return (
    <GameLayout
      chapterId={game}
      numeral={info?.numeral}
      title={info?.chapter ?? ""}
      onBack={handleBack}
      onHome={onHome}
      onHelp={phase === "level" ? () => helpRef.current?.() : undefined}
      rules={<RulesContent rules={rules} />}
      expression={loro?.expression ?? defaultExpression}
      message={loro ? loro.message : defaultMessage}
      helpText={HELP_TEXT}
    >
      <div key={phase} className="fade-in">
      {phase === "rules" && (
        <RulesScreen
          rules={rules}
          onPlay={(chosen) => {
            setMode(chosen);
            setPhase("levels");
          }}
        />
      )}
      {phase === "levels" && (
        <LevelSelect game={game} mode={mode} onSelect={startLevel} />
      )}
      {phase === "level" && plan && (
        <LevelRunner
          key={runId}
          exercises={plan.exercises}
          mode={mode}
          onFinish={handleFinish}
          setLoro={setLoro}
          registerHelp={registerHelp}
        />
      )}
      </div>
    </GameLayout>
  );
};

export default GameShell;
