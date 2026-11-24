import { useSpeech } from "@/hook/useSpeech";
import "./SpeakButton.css";

interface SpeakButtonProps {
  text: string;
  file?: string; // archivo de grabación dentro de public/audio/ (opcional)
  label?: string;
}

// Botón de altavoz: lee el texto con la grabación real o la voz del navegador
const SpeakButton = ({ text, file, label = "Escuchar" }: SpeakButtonProps) => {
  const { speak, stop, speaking } = useSpeech();

  return (
    <button
      type="button"
      className={`speak-btn ${speaking ? "is-speaking" : ""}`}
      aria-label={label}
      title={label}
      onClick={() => (speaking ? stop() : void speak(text, { file }))}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        <path
          d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default SpeakButton;
