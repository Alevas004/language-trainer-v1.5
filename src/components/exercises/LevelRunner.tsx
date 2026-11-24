import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { PRAISE, TRY_AGAIN, pickOne } from "@/data/common";
import { useSettings } from "@/hook/useSettings";
import { useSpeech } from "@/hook/useSpeech";
import type { LoroExpression, Mode } from "@/types";
import type { Exercise } from "@/types/exercises";
import ChoiceExercise from "./ChoiceExercise";
import SlotsExercise from "./SlotsExercise";
import SortExercise from "./SortExercise";
import TallyExercise from "./TallyExercise";
import "./LevelRunner.css";

export interface LoroState {
  expression: LoroExpression;
  message?: string;
}

interface LevelRunnerProps {
  exercises: Exercise[];
  mode: Mode;
  finishLabel?: string;
  onFinish: (hintsUsed: number) => void;
  setLoro: (state: LoroState | null) => void;
  registerHelp: (handler: (() => void) | null) => void;
}

// En modo normal la pista llega más tarde; con ayuda extra, enseguida
const WRONG_BEFORE_HINT = { normal: 3, support: 1 };
const IDLE_BEFORE_HINT_MS = { normal: 25000, support: 12000 };

// Muestra los ejercicios de una página uno por uno, con pistas escalonadas.
// Nunca hay errores visibles: una respuesta equivocada solo vuelve a su sitio.
const LevelRunner = ({
  exercises,
  mode,
  finishLabel = "Terminar página",
  onFinish,
  setLoro,
  registerHelp,
}: LevelRunnerProps) => {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [totalHints, setTotalHints] = useState(0);

  const exercise = exercises[index];
  const isLast = index === exercises.length - 1;

  const requestHint = useCallback(() => {
    if (solved) return;
    if (hintsShown >= exercise.hints.length) {
      setLoro({ expression: "wink", message: "Tú puedes. Tómate tu tiempo." });
      return;
    }
    const text = exercise.hints[hintsShown];
    setHintsShown((n) => n + 1);
    setTotalHints((n) => n + 1);
    setLoro({ expression: "explaining", message: text });
    void speak(text);
  }, [solved, hintsShown, exercise.hints, setLoro, speak]);

  // El botón Ayuda y Señor Loro piden la pista del ejercicio actual
  const helpRef = useRef(requestHint);
  helpRef.current = requestHint;
  useEffect(() => {
    registerHelp(() => helpRef.current());
    return () => registerHelp(null);
  }, [registerHelp]);

  // Al empezar cada ejercicio se oye su audio, si lo tiene
  useEffect(() => {
    if (!exercise.speak) return;
    const timer = window.setTimeout(() => void speak(exercise.speak!), 400);
    return () => window.clearTimeout(timer);
  }, [index]);

  // Si el niño se queda quieto, Señor Loro ofrece una pista
  useEffect(() => {
    if (solved) return;
    const timer = window.setTimeout(
      () => helpRef.current(),
      IDLE_BEFORE_HINT_MS[mode]
    );
    return () => window.clearTimeout(timer);
  }, [index, wrongCount, hintsShown, solved, mode]);

  // Temporizador opcional: al terminar solo ofrece una pista (nunca resta nada)
  useEffect(() => {
    if (!settings.timerEnabled || solved) return;
    const timer = window.setTimeout(
      () => helpRef.current(),
      settings.timerSeconds * 1000
    );
    return () => window.clearTimeout(timer);
  }, [index, hintsShown, solved, settings.timerEnabled, settings.timerSeconds]);

  const handleWrong = useCallback(
    (explain?: string) => {
      const count = wrongCount + 1;
      setWrongCount(count);
      if (explain) {
        setLoro({ expression: "explaining", message: explain });
        void speak(explain);
      } else if (count % WRONG_BEFORE_HINT[mode] === 0) {
        window.setTimeout(() => helpRef.current(), 250);
      } else {
        setLoro({ expression: "thinking", message: pickOne(TRY_AGAIN) });
      }
    },
    [wrongCount, mode, setLoro, speak]
  );

  const handleSolved = useCallback(() => {
    setSolved(true);
    const message = [pickOne(PRAISE), exercise.success].filter(Boolean).join(" ");
    setLoro({ expression: "happy", message });
    void speak(message);
  }, [exercise.success, setLoro, speak]);

  const next = () => {
    if (isLast) {
      onFinish(totalHints);
      return;
    }
    setIndex((i) => i + 1);
    setSolved(false);
    setWrongCount(0);
    setHintsShown(0);
    setLoro(null);
  };

  const common = { solved, onSolved: handleSolved, onWrong: handleWrong };

  return (
    <div className="runner">
      <div className="runner-top">
        <div className="runner-progress" aria-label={`Ejercicio ${index + 1} de ${exercises.length}`}>
          {exercises.map((_, i) => (
            <span
              key={i}
              className={`runner-dot ${i < index || (i === index && solved) ? "runner-dot-done" : ""} ${i === index ? "runner-dot-now" : ""}`}
            />
          ))}
          <span className="runner-count">
            {index + 1} de {exercises.length}
          </span>
        </div>
        {settings.timerEnabled && !solved && (
          <div className="timer" aria-hidden="true">
            <div
              key={`${index}-${hintsShown}`}
              className="timer-fill"
              style={{ animationDuration: `${settings.timerSeconds}s` }}
            />
          </div>
        )}
      </div>

      <div key={exercise.id} className="fade-in">
        {exercise.kind === "choice" && <ChoiceExercise exercise={exercise} {...common} />}
        {exercise.kind === "tally" && <TallyExercise exercise={exercise} {...common} />}
        {exercise.kind === "slots" && <SlotsExercise exercise={exercise} {...common} />}
        {exercise.kind === "sort" && <SortExercise exercise={exercise} {...common} />}
      </div>

      <div className="runner-actions">
        <Button variant="quiet" disabled={solved} onClick={requestHint}>
          Necesito una pista
        </Button>
        {solved && (
          <Button variant="primary" data-next onClick={next}>
            {isLast ? finishLabel : "Siguiente →"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LevelRunner;
