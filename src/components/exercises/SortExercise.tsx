import { useCallback, useState } from "react";
import SpeakButton from "@/components/common/SpeakButton";
import { useDragDrop } from "@/hook/useDragDrop";
import type { SortExercise as SortData, SortItem } from "@/types/exercises";
import Picture from "./Picture";
import "./Exercise.css";
import "./SortExercise.css";

interface SortExerciseProps {
  exercise: SortData;
  solved: boolean;
  onSolved: () => void;
  onWrong: () => void;
}

// Arrastra cada imagen a su grupo (o toca la imagen y luego el grupo)
const SortExercise = ({ exercise, solved, onSolved, onWrong }: SortExerciseProps) => {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [wobbleId, setWobbleId] = useState<string | null>(null);

  const place = useCallback(
    (item: SortItem, groupId: string) => {
      if (solved) return;
      if (item.group === groupId) {
        const next = { ...placed, [item.id]: groupId };
        setPlaced(next);
        setSelected(null);
        if (Object.keys(next).length === exercise.items.length) onSolved();
      } else {
        // La pieza vuelve a su sitio, sin marcas de error
        setSelected(null);
        setWobbleId(item.id);
        onWrong();
        window.setTimeout(() => setWobbleId(null), 400);
      }
    },
    [placed, solved, exercise.items.length, onSolved, onWrong]
  );

  const onTap = useCallback((id: string) => setSelected((s) => (s === id ? null : id)), []);

  const onDrop = useCallback(
    (id: string, targetId: string) => {
      if (!targetId.startsWith("group-")) return;
      const item = exercise.items.find((i) => i.id === id);
      if (item) place(item, targetId.slice(6));
    },
    [exercise.items, place]
  );

  const { bind, ghost } = useDragDrop<string>({ onDrop, onTap });

  const pool = exercise.items.filter((i) => !(i.id in placed));

  return (
    <div className="exercise">
      <div className="exercise-instruction">
        <p>{exercise.instruction}</p>
        <SpeakButton text={exercise.instruction} label="Escuchar la instrucción" />
      </div>

      <div className="groups-row">
        {exercise.groups.map((group) => {
          const inside = exercise.items.filter((i) => placed[i.id] === group.id);
          return (
            <div key={group.id} className="group-box" data-drop={`group-${group.id}`}>
              <button
                type="button"
                className="group-title"
                data-group-id={import.meta.env.DEV ? group.id : undefined}
                disabled={solved || selected === null}
                onClick={() => {
                  const item = exercise.items.find((i) => i.id === selected);
                  if (item) place(item, group.id);
                }}
              >
                {group.emoji && <Picture emoji={group.emoji} size="sm" />}
                <span>{group.label}</span>
              </button>
              <div className="group-items">
                {inside.map((item) => (
                  <Picture key={item.id} emoji={item.emoji} size="md" />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sort-pool">
        {pool.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sort-item draggable ${selected === item.id ? "sort-selected" : ""} ${wobbleId === item.id ? "settle" : ""}`}
            data-group={import.meta.env.DEV ? item.group : undefined}
            aria-label={item.label}
            {...bind(item.id, <Picture emoji={item.emoji} size="md" />)}
          >
            <Picture emoji={item.emoji} size="md" />
            <span className="sort-label">{item.label}</span>
          </button>
        ))}
      </div>

      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x, top: ghost.y }}>
          {ghost.content}
        </div>
      )}
    </div>
  );
};

export default SortExercise;
