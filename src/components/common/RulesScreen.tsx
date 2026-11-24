import type { GameRules } from "@/data/rules";
import { useSettings } from "@/hook/useSettings";
import type { Mode } from "@/types";
import Button from "@/components/ui/Button";
import RulesContent from "./RulesContent";
import "./RulesScreen.css";

interface RulesScreenProps {
  rules: GameRules;
  onPlay: (mode: Mode) => void;
}

// Después de la interfaz vienen las reglas y luego el botón de jugar.
// "Con ayuda extra" es la nivelación; el docente puede fijar un solo modo.
const RulesScreen = ({ rules, onPlay }: RulesScreenProps) => {
  const { settings } = useSettings();
  const fixed = settings.fixedMode;

  return (
    <div className="rules-screen">
      <RulesContent rules={rules} />
      <div className="play-actions">
        {fixed !== "support" && (
          <Button variant="primary" onClick={() => onPlay("normal")}>
            Jugar
          </Button>
        )}
        {fixed !== "normal" && (
          <Button
            variant={fixed === "support" ? "primary" : "secondary"}
            onClick={() => onPlay("support")}
          >
            Jugar con ayuda extra
          </Button>
        )}
      </div>
    </div>
  );
};

export default RulesScreen;
