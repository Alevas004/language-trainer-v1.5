import GameShell from "@/components/common/GameShell";
import { buildLexiconLevel } from "@/data/lexicon/levels";

interface LexiconProps {
  onExit: () => void;
  onHome: () => void;
}

// Léxico-semántico: El Jardín de las Palabras
const Lexicon = ({ onExit, onHome }: LexiconProps) => (
  <GameShell game="lexicon" build={buildLexiconLevel} onExit={onExit} onHome={onHome} />
);

export default Lexicon;
