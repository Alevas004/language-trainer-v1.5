import LockIcon from "@/components/ui/LockIcon";
import { LEVELS } from "@/data/structure";
import { useProgress } from "@/hook/useProgress";
import type { LevelNumber, Mode, SubcomponentId } from "@/types";
import "./LevelSelect.css";

interface LevelSelectProps {
  game: SubcomponentId;
  mode: Mode;
  onSelect: (level: LevelNumber) => void;
}

// Las 5 páginas del capítulo: se abren de una en una
const LevelSelect = ({ game, mode, onSelect }: LevelSelectProps) => {
  const { isLevelCompleted, isLevelUnlocked, completedCount } = useProgress();

  return (
    <div className="level-select">
      <div className="level-select-head">
        <h2>Elige una página</h2>
        <p>
          {completedCount(game)} de {LEVELS.length} páginas
          {mode === "support" ? " · con ayuda extra" : ""}
        </p>
      </div>
      <div className="pages">
        {LEVELS.map((level) => {
          const done = isLevelCompleted(game, level);
          const unlocked = isLevelUnlocked(game, level);
          return (
            <button
              key={level}
              type="button"
              className={`page-card ${done ? "page-done" : ""}`}
              disabled={!unlocked}
              onClick={() => onSelect(level)}
              aria-label={`Página ${level}${done ? ", completada" : unlocked ? "" : ", bloqueada"}`}
            >
              <span className="page-number">{level}</span>
              <span className="page-state" aria-hidden="true">
                {done ? (
                  <span className="page-seal">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : unlocked ? null : (
                  <LockIcon size={24} />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelect;
