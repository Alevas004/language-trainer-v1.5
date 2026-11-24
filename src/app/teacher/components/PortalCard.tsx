import ChapterEmblem from "@/components/common/ChapterEmblem";
import LockIcon from "@/components/ui/LockIcon";
import { LEVELS } from "@/data/structure";
import type { SubcomponentId } from "@/types";
import "./PortalCard.css";

interface PortalCardProps {
  chapterId: SubcomponentId | "boss";
  numeral?: string;
  chapter: string;
  name: string;
  completedLevels?: number; // páginas completadas (0 a 5)
  locked?: boolean;
  lockedText?: string;
  onClick: () => void;
}

// Entrada del índice del libro: lleva a un capítulo (o al boss)
const PortalCard = ({
  chapterId,
  numeral,
  chapter,
  name,
  completedLevels,
  locked = false,
  lockedText,
  onClick,
}: PortalCardProps) => {
  const showProgress = completedLevels !== undefined && !locked;

  return (
    <button
      type="button"
      className={`portal chapter-${chapterId} ${locked ? "portal-locked" : ""}`}
      disabled={locked}
      onClick={onClick}
    >
      <ChapterEmblem chapter={chapterId} size={54} />
      <span className="portal-text">
        <span className="portal-chapter">
          {numeral && <span className="portal-numeral">{numeral}.</span>} {chapter}
        </span>
        <span className="portal-name">{locked ? lockedText : name}</span>
        {showProgress && (
          <span className="portal-progress">
            <span className="mini-pages" aria-hidden="true">
              {LEVELS.map((level) => (
                <span
                  key={level}
                  className={`mini-page ${level <= completedLevels ? "mini-page-done" : ""}`}
                />
              ))}
            </span>
            <span>
              {completedLevels} de {LEVELS.length} páginas
            </span>
          </span>
        )}
      </span>
      {locked && (
        <span className="portal-lock">
          <LockIcon size={22} />
        </span>
      )}
    </button>
  );
};

export default PortalCard;
