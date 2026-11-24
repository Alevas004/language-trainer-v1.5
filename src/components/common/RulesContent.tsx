import type { GameRules } from "@/data/rules";
import { RULES_AUDIO_TEXT } from "@/data/rules";
import SpeakButton from "./SpeakButton";
import "./RulesContent.css";

interface RulesContentProps {
  rules: GameRules;
}

// Texto de las reglas con botón para escucharlas (sin muros de texto)
const RulesContent = ({ rules }: RulesContentProps) => {
  return (
    <div className="rules">
      <div className="rules-intro">
        <p>{rules.intro}</p>
        <SpeakButton
          text={RULES_AUDIO_TEXT(rules)}
          file={rules.audio}
          label="Escuchar las reglas"
        />
      </div>
      <ul>
        {rules.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
};

export default RulesContent;
