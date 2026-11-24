import SpeakButton from "./SpeakButton";
import "./HintBubble.css";

interface HintBubbleProps {
  message: string;
  file?: string; // grabación real del mensaje, si existe
}

// Globo de diálogo de Señor Loro, con botón para escucharlo
const HintBubble = ({ message, file }: HintBubbleProps) => {
  return (
    <div className="hint-bubble" role="status">
      <p>{message}</p>
      <SpeakButton text={message} file={file} label="Escuchar a Señor Loro" />
    </div>
  );
};

export default HintBubble;
