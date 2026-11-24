export interface Manipulation {
  id: string;
  type: "omit" | "add" | "change";
  base: { word: string; emoji: string };
  result: { word: string; emoji: string };
  sound: string; // sonido que se quita o se añade
  to?: string; // sonido nuevo (solo en "change")
}

const m = (
  type: Manipulation["type"],
  base: [string, string],
  result: [string, string],
  sound: string,
  to?: string
): Manipulation => ({
  id: `m:${type}:${base[0]}-${result[0]}`,
  type,
  base: { word: base[0], emoji: base[1] },
  result: { word: result[0], emoji: result[1] },
  sound,
  to,
});

// Manipulación de fonemas: omitir, añadir o cambiar un sonido
export const MANIPULATIONS: Manipulation[] = [
  // omitir
  m("omit", ["plato", "🍽️"], ["pato", "🦆"], "l"),
  m("omit", ["globo", "🎈"], ["lobo", "🐺"], "g"),
  m("omit", ["plata", "🥈"], ["pata", "🐾"], "l"),
  // añadir
  m("add", ["pato", "🦆"], ["plato", "🍽️"], "l"),
  m("add", ["lobo", "🐺"], ["globo", "🎈"], "g"),
  m("add", ["pata", "🐾"], ["plata", "🥈"], "l"),
  // cambiar
  m("change", ["rana", "🐸"], ["lana", "🧶"], "r", "l"),
  m("change", ["mano", "✋"], ["mono", "🐒"], "a", "o"),
  m("change", ["gato", "🐱"], ["pato", "🦆"], "g", "p"),
  m("change", ["sopa", "🍲"], ["ropa", "👕"], "s", "r"),
  m("change", ["pino", "🌲"], ["vino", "🍷"], "p", "v"),
  m("change", ["queso", "🧀"], ["beso", "💋"], "qu", "b"),
  m("change", ["casa", "🏠"], ["taza", "☕"], "c", "t"),
  m("change", ["toro", "🐂"], ["loro", "🦜"], "t", "l"),
  m("change", ["lata", "🥫"], ["rata", "🐀"], "l", "r"),
];
