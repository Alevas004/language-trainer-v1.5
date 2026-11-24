import SpeakButton from "@/components/common/SpeakButton";
import type { Stimulus as StimulusData } from "@/types/exercises";
import Picture from "./Picture";
import "./Exercise.css";

interface StimulusProps {
  stimulus?: StimulusData;
  filledWord?: string; // palabra que completa el hueco cuando se acierta
  reply?: string | null; // respuesta natural del personaje
  speak?: string;
  onReplaySounds?: () => void;
}

// Parte superior de un ejercicio: imagen, frase con hueco, personaje o sonidos
const Stimulus = ({
  stimulus,
  filledWord,
  reply,
  speak,
  onReplaySounds,
}: StimulusProps) => {
  if (!stimulus && !speak) return null;
  const { emoji, emojiRepeat, sentence, speaker, line, sounds } = stimulus ?? {};

  const renderSentence = (text: string) => {
    const parts = text.split("___");
    return (
      <p className="stimulus-sentence">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className={`blank ${filledWord ? "blank-filled" : ""}`}>
                {filledWord ?? "\u00a0"}
              </span>
            )}
          </span>
        ))}
      </p>
    );
  };

  return (
    <div className="stimulus">
      {emoji && <Picture emoji={emoji} size="lg" repeat={emojiRepeat ?? 1} />}

      {speaker && (
        <div className="speaker-panel">
          <div className="speaker-who">
            <span className="speaker-faces">
              <span>{speaker.emoji}</span>
              {speaker.expression && <span className="face">{speaker.expression}</span>}
            </span>
            <span>{speaker.name}</span>
          </div>
          <div>
            {line && (
              <p className="speaker-line">
                «{line}»
                {speaker.tone && <span className="speaker-tone">{speaker.tone}</span>}
              </p>
            )}
            {reply && <p className="speaker-reply">{reply}</p>}
          </div>
        </div>
      )}

      {sentence && renderSentence(sentence)}

      {sounds && onReplaySounds && (
        <button type="button" className="sound-btn" onClick={onReplaySounds}>
          🔊 Escuchar los sonidos
        </button>
      )}

      {!speaker && speak && <SpeakButton text={speak} label="Escuchar otra vez" />}
      {speaker && line && <SpeakButton text={line} label="Escuchar lo que dice" />}
    </div>
  );
};

export default Stimulus;
