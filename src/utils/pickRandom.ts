/** Mezcla una lista (Fisher-Yates) sin modificar la original */
export const shuffle = <T>(items: readonly T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Elige `count` ítems al azar del banco, sin repetir y evitando los usados
 * recientemente. `recentIds` va ordenado del más antiguo al más reciente:
 * si no alcanzan los ítems "frescos", se completa con los usados hace más tiempo.
 */
export const pickRandom = <T extends { id: string }>(
  pool: readonly T[],
  count: number,
  recentIds: readonly string[] = []
): T[] => {
  const fresh = pool.filter((item) => !recentIds.includes(item.id));
  const chosen = shuffle(fresh).slice(0, count);

  if (chosen.length < count) {
    const missing = count - chosen.length;
    const oldest = recentIds
      .map((id) => pool.find((item) => item.id === id))
      .filter((item): item is T => item !== undefined && !chosen.includes(item));
    chosen.push(...oldest.slice(0, missing));
  }

  return shuffle(chosen);
};
