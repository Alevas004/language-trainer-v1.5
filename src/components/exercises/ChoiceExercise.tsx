import { useEffect, useState } from "react";
import SpeakButton from "@/components/common/SpeakButton";
import { useSettings } from "@/hook/useSettings";
import type { ChoiceExercise as ChoiceData, ChoiceOption } from "@/types/exercises";
import { playSequence } from "@/utils/tones";
import Picture from "./Picture";
import Stimulus from "./Stimulus";
import "./Exercise.css";
import "./ChoiceExercise.css";

interface ChoiceExerciseProps {
  exercise: ChoiceData;
  solved: boolean;
  onSolved: () => void;
  onWrong: (explain?: string) => void;
}

// Solo en pruebas: marca la opción correcta para poder automatizarlas
const devCorrect = (isCorrect: boolean) =>
  import.meta.env.DEV && isCorrect ? "true" : undefined;

const ChoiceExercise = ({ exercise, solved, onSolved, onWrong }: ChoiceExerciseProps) => {
  const { settings } = useSettings();
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);

  const sounds = exercise.stimulus?.sounds;

  // Sonidos no verbales: suenan al empezar
  useEffect(() => {
    if (!sounds) return;
    const timer = window.setTimeout(
      () => void playSequence(sounds, settings.volume),
      450
    );
    return () => window.clearTimeout(timer);
  }, []);

  const pick = (option: ChoiceOption) => {
    if (solved) return;
    if (option.id === exercise.correct) {
      setPickedId(option.id);
      setReply(null);
      onSolved();
    } else {
      setWrongId(option.id);
      setReply(option.reply ?? null);
      onWrong(option.explain);
      window.setTimeout(() => setWrongId(null), 400);
    }
  };

  const correctOption = exercise.options.find((o) => o.id === exercise.correct);

  return (
    <div className="exercise">
      <div className="exercise-instruction">
        <p>{exercise.instruction}</p>
        <SpeakButton text={exercise.instruction} label="Escuchar la instrucción" />
      </div>

      <Stimulus
        stimulus={exercise.stimulus}
        filledWord={solved ? correctOption?.text : undefined}
        reply={reply}
        speak={exercise.speak}
        onReplaySounds={sounds ? () => void playSequence(sounds, settings.volume) : undefined}
      />

      <div className={`options options-${exercise.layout}`}>
        {exercise.options.map((option) => (
          <div
            key={option.id}
            className={`option ${wrongId === option.id ? "settle" : ""}`}
          >
            <button
              type="button"
              className={`option-main ${pickedId === option.id ? "option-right" : ""}`}
              disabled={solved && pickedId !== option.id}
              data-correct={devCorrect(option.id === exercise.correct)}
              onClick={() => pick(option)}
            >
              {option.emoji && <Picture emoji={option.emoji} size="md" />}
              {option.text && <span className="option-text">{option.text}</span>}
            </button>
            {option.say && (
              <SpeakButton
                text={option.say}
                label={`Escuchar ${option.say}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoiceExercise;
