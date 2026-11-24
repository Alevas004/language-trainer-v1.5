import GameShell from "@/components/common/GameShell";
import { buildPhonologyLevel } from "@/data/phonology/levels";

interface PhonologyProps {
  onExit: () => void;
  onHome: () => void;
}

// Fonético-fonológico: El Bosque de los Sonidos
const Phonology = ({ onExit, onHome }: PhonologyProps) => (
  <GameShell game="phonology" build={buildPhonologyLevel} onExit={onExit} onHome={onHome} />
);

export default Phonology;
