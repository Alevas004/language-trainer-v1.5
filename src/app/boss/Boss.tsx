import { useCallback, useRef, useState } from "react";
import Companion from "@/components/common/Companion";
import RulesContent from "@/components/common/RulesContent";
import RulesScreen from "@/components/common/RulesScreen";
import LevelRunner, { type LoroState } from "@/components/exercises/LevelRunner";
import Button from "@/components/ui/Button";
import { buildBossPlan } from "@/data/boss";
import { BOSS_RULES } from "@/data/rules";
import { BOSS_CHAPTER } from "@/data/structure";
import { useProgress } from "@/hook/useProgress";
import GameLayout from "@/layouts/GameLayout";
import type { Mode } from "@/types";
import type { LevelPlan } from "@/types/exercises";
import "./Boss.css";

interface BossProps {
  onExit: () => void;
  onHome: () => void;
}

type Phase = "rules" | "play" | "done";

// La Gran Página: 8 retos mezclados (2 de cada juego)
const Boss = ({ onExit, onHome }: BossProps) => {
  const [phase, setPhase] = useState<Phase>("rules");
  const [mode, setMode] = useState<Mode>("normal");
  const [plan, setPlan] = useState<LevelPlan | null>(null);
  const [loro, setLoro] = useState<LoroState | null>(null);
  const helpRef = useRef<(() => void) | null>(null);
  const { markBossCompleted } = useProgress();

  const registerHelp = useCallback((handler: (() => void) | null) => {
    helpRef.current = handler;
  }, []);

  const handleBack = () => {
    setLoro(null);
    if (phase === "play") setPhase("rules");
    else onExit();
  };

  return (
    <GameLayout
      chapterId="boss"
      title={BOSS_CHAPTER}
      onBack={handleBack}
      onHome={onHome}
      onHelp={phase === "play" ? () => helpRef.current?.() : undefined}
      rules={<RulesContent rules={BOSS_RULES} />}
      expression={loro?.expression ?? (phase === "done" ? "wink" : phase === "play" ? "thinking" : "explaining")}
      message={
        loro
          ? loro.message
          : phase === "rules"
            ? "Llegamos a la última página. ¡Tú puedes!"
            : phase === "done"
              ? "¡Lo lograste! El libro está completo."
              : undefined
      }
      helpText="Toca o arrastra con tu varita. Si no sabes qué hacer, pídeme una pista."
    >
      {phase === "rules" && (
        <RulesScreen
          rules={BOSS_RULES}
          onPlay={(chosen) => {
            setMode(chosen);
            setPlan(buildBossPlan(chosen));
            setLoro(null);
            setPhase("play");
          }}
        />
      )}
      {phase === "play" && plan && (
        <LevelRunner
          exercises={plan.exercises}
          mode={mode}
          finishLabel="Terminar el libro"
          onFinish={() => {
            markBossCompleted();
            setLoro(null);
            setPhase("done");
          }}
          setLoro={setLoro}
          registerHelp={registerHelp}
        />
      )}
      {phase === "done" && (
        <div className="boss-done">
          <Companion expression="wink" size={180} />
          <h2>¡El libro está completo!</h2>
          <p>Devolviste todas las palabras a su lugar. Gracias por tu ayuda.</p>
          <Button onClick={onHome}>Volver al inicio</Button>
        </div>
      )}
    </GameLayout>
  );
};

export default Boss;
