import { useState } from "react";
import SpeakButton from "@/components/common/SpeakButton";
import Button from "@/components/ui/Button";
import type { TallyExercise as TallyData } from "@/types/exercises";
import Picture from "./Picture";
import "./Exercise.css";
import "./TallyExercise.css";

interface TallyExerciseProps {
  exercise: TallyData;
  solved: boolean;
  onSolved: () => void;
  onWrong: () => void;
}

const MAX_TAPS = 10;

// Escucha y cuenta: una piedrita en el cofre por cada palabra o sílaba
const TallyExercise = ({ exercise, solved, onSolved, onWrong }: TallyExerciseProps) => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const add = () => {
    if (solved) return;
    setMessage(null);
    setCount((c) => Math.min(c + 1, MAX_TAPS));
  };

  const check = () => {
    if (solved || count === 0) return;
    if (count === exercise.target) {
      onSolved();
    } else {
      setMessage("Empecemos de nuevo, con calma.");
      setCount(0);
      onWrong();
    }
  };

  return (
    <div
      className="exercise"
      data-target={import.meta.env.DEV ? exercise.target : undefined}
    >
      <div className="exercise-instruction">
        <p>{exercise.instruction}</p>
        <SpeakButton text={exercise.instruction} label="Escuchar la instrucción" />
      </div>

      <div className="stimulus">
        {exercise.stimulus?.emoji && <Picture emoji={exercise.stimulus.emoji} size="lg" />}
        {exercise.speak && (
          <SpeakButton text={exercise.speak} label="Escuchar otra vez" />
        )}
        {exercise.units && (
          <div className="units" aria-label="Apoyo visual">
            {exercise.units.map((unit, i) => (
              <span key={i} className={`unit ${i < count ? "unit-on" : ""}`}>
                {unit}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="chest" aria-live="polite">
        <span className="chest-label">Cofre</span>
        <div className="chest-stones">
          {count === 0 && <span className="chest-empty">vacío</span>}
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className="stone" />
          ))}
        </div>
        {message && <span className="chest-message">{message}</span>}
      </div>

      <div className="tally-actions">
        <Button
          variant="secondary"
          disabled={solved}
          data-tap
          onClick={add}
        >
          + una piedra 🟤
        </Button>
        <Button
          variant="quiet"
          disabled={solved || count === 0}
          onClick={() => setCount((c) => Math.max(c - 1, 0))}
        >
          - una piedra 🟤
        </Button>
        <Button variant="primary" disabled={solved || count === 0} data-done onClick={check}>
          Listo
        </Button>
      </div>
    </div>
  );
};

export default TallyExercise;
