import { useCallback, useEffect, useRef, useState } from "react";
import SpeakButton from "@/components/common/SpeakButton";
import { useDragDrop } from "@/hook/useDragDrop";
import type { SlotsExercise as SlotsData, Token } from "@/types/exercises";
import Picture from "./Picture";
import Stimulus from "./Stimulus";
import "./Exercise.css";
import "./SlotsExercise.css";

interface SlotsExerciseProps {
  exercise: SlotsData;
  solved: boolean;
  onSolved: () => void;
  onWrong: () => void;
}

type Payload = { from: "bank"; id: string } | { from: "slot"; index: number };

const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// Piezas que se mueven con un clic o arrastrando a su hueco
const SlotsExercise = ({ exercise, solved, onSolved, onWrong }: SlotsExerciseProps) => {
  const slotCount = exercise.answers.length;
  const lockedCount = exercise.prefilled?.length ?? 0;

  const [slots, setSlots] = useState<(Token | null)[]>(() =>
    Array.from({ length: slotCount }, (_, i) => exercise.prefilled?.[i] ?? null)
  );
  const [bank, setBank] = useState<Token[]>(exercise.bank);
  const [wobble, setWobble] = useState<number[]>([]);
  const checking = useRef(false);

  const firstPartIsSlotZero =
    exercise.template[0] !== undefined && "slot" in exercise.template[0] && exercise.template[0].slot === 0;

  const label = (token: Token, slotIndex?: number): string => {
    if (token.emoji) return token.caption ?? "";
    const text = token.text ?? token.value;
    return slotIndex === 0 && firstPartIsSlotZero ? capitalizeFirst(text) : text;
  };

  // Cuando todos los huecos están llenos se comprueba la respuesta
  const evaluate = useCallback(
    (current: (Token | null)[]) => {
      if (checking.current || current.some((t) => t === null)) return;
      const wrong = current
        .map((token, i) => (token && token.value !== exercise.answers[i] ? i : -1))
        .filter((i) => i >= 0);
      if (wrong.length === 0) {
        onSolved();
        return;
      }
      checking.current = true;
      onWrong();
      setWobble(wrong);
      window.setTimeout(() => {
        // Solo vuelven al banco las piezas mal colocadas
        setSlots((prev) => prev.map((t, i) => (wrong.includes(i) ? null : t)));
        setBank((prev) => [
          ...prev,
          ...wrong.map((i) => current[i]).filter((t): t is Token => t !== null),
        ]);
        setWobble([]);
        checking.current = false;
      }, 700);
    },
    [exercise.answers, onSolved, onWrong]
  );

  const placeInSlot = useCallback(
    (token: Token, fromSlot: number | null, target: number | null) => {
      if (solved || checking.current) return;
      const next = [...slots];
      let nextBank = bank.filter((t) => t.id !== token.id);
      const index = target ?? next.findIndex((t, i) => t === null && i >= lockedCount);
      if (index < lockedCount) return;
      if (fromSlot !== null) next[fromSlot] = null;
      const occupant = next[index];
      if (occupant) {
        if (fromSlot !== null) next[fromSlot] = occupant;
        else nextBank = [...nextBank, occupant];
      }
      next[index] = token;
      setSlots(next);
      setBank(nextBank);
      evaluate(next);
    },
    [slots, bank, solved, lockedCount, evaluate]
  );

  const returnToBank = useCallback(
    (index: number) => {
      if (solved || checking.current || index < lockedCount) return;
      const token = slots[index];
      if (!token) return;
      setSlots((prev) => prev.map((t, i) => (i === index ? null : t)));
      setBank((prev) => [...prev, token]);
    },
    [slots, solved, lockedCount]
  );

  const onTap = useCallback(
    (payload: Payload) => {
      if (payload.from === "bank") {
        const token = bank.find((t) => t.id === payload.id);
        if (token) placeInSlot(token, null, null);
      } else {
        returnToBank(payload.index);
      }
    },
    [bank, placeInSlot, returnToBank]
  );

  const onDrop = useCallback(
    (payload: Payload, targetId: string) => {
      if (targetId === "bank") {
        if (payload.from === "slot") returnToBank(payload.index);
        return;
      }
      if (!targetId.startsWith("slot-")) return;
      const target = Number(targetId.slice(5));
      if (payload.from === "bank") {
        const token = bank.find((t) => t.id === payload.id);
        if (token) placeInSlot(token, null, target);
      } else {
        const token = slots[payload.index];
        if (token && payload.index !== target) placeInSlot(token, payload.index, target);
      }
    },
    [bank, slots, placeInSlot, returnToBank]
  );

  const { bind, ghost } = useDragDrop<Payload>({ onDrop, onTap });

  // Al terminar bien, no hace falta nada más (el motor ya avisó)
  useEffect(() => {
    if (solved) checking.current = false;
  }, [solved]);

  const tokenView = (token: Token, slotIndex?: number) => (
    <>
      {token.emoji && <Picture emoji={token.emoji} size="md" />}
      <span>{label(token, slotIndex)}</span>
    </>
  );

  const renderSlot = (index: number) => {
    const token = slots[index];
    const locked = index < lockedCount;
    return (
      <span key={`slot-${index}`} className="slot-wrap">
        {exercise.slotLabels && <span className="slot-label">{exercise.slotLabels[index]}</span>}
        <span
          className={`slot ${token ? "slot-filled" : ""} ${wobble.includes(index) ? "settle" : ""} ${exercise.tokenLayout === "cards" ? "slot-card" : ""}`}
          data-drop={`slot-${index}`}
        >
          {token && (
            <button
              type="button"
              className={`token token-${exercise.tokenLayout} ${locked ? "token-locked" : "draggable"}`}
              disabled={locked}
              {...(locked ? {} : bind({ from: "slot", index }, tokenView(token, index)))}
            >
              {tokenView(token, index)}
            </button>
          )}
        </span>
      </span>
    );
  };

  return (
    <div className="exercise">
      <div className="exercise-instruction">
        <p>{exercise.instruction}</p>
        <SpeakButton text={exercise.instruction} label="Escuchar la instrucción" />
      </div>

      <Stimulus stimulus={exercise.stimulus} speak={exercise.speak} />

      <div
        className={`template template-${exercise.tokenLayout}`}
        data-answers={import.meta.env.DEV ? JSON.stringify(exercise.answers) : undefined}
      >
        {exercise.template.map((part, i) =>
          "slot" in part ? (
            renderSlot(part.slot)
          ) : (
            <span key={`t-${i}`} className="template-text">
              {part.text}
            </span>
          )
        )}
      </div>

      <div className="bank" data-drop="bank">
        {bank.length === 0 && <span className="bank-empty">No quedan piezas</span>}
        {bank.map((token) => (
          <button
            key={token.id}
            type="button"
            className={`token token-${exercise.tokenLayout} draggable`}
            data-value={import.meta.env.DEV ? token.value : undefined}
            {...bind({ from: "bank", id: token.id }, tokenView(token))}
          >
            {tokenView(token)}
          </button>
        ))}
      </div>

      {ghost && (
        <div className="drag-ghost token" style={{ left: ghost.x, top: ghost.y }}>
          {ghost.content}
        </div>
      )}
    </div>
  );
};

export default SlotsExercise;
