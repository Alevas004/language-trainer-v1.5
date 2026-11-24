import GameShell from "@/components/common/GameShell";
import { buildPragmaticsLevel } from "@/data/pragmatics/levels";

interface PragmaticsProps {
  onExit: () => void;
  onHome: () => void;
}

// Pragmático: La Plaza de las Conversaciones
const Pragmatics = ({ onExit, onHome }: PragmaticsProps) => (
  <GameShell game="pragmatics" build={buildPragmaticsLevel} onExit={onExit} onHome={onHome} />
);

export default Pragmatics;
