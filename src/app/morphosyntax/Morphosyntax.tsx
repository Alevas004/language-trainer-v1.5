import GameShell from "@/components/common/GameShell";
import { buildMorphosyntaxLevel } from "@/data/morphosyntax/levels";

interface MorphosyntaxProps {
  onExit: () => void;
  onHome: () => void;
}

// Morfo-sintáctico: El Taller de las Frases
const Morphosyntax = ({ onExit, onHome }: MorphosyntaxProps) => (
  <GameShell game="morphosyntax" build={buildMorphosyntaxLevel} onExit={onExit} onHome={onHome} />
);

export default Morphosyntax;
