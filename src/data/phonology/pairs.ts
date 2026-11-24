export interface MinimalPair {
  id: string;
  a: { word: string; emoji: string };
  b: { word: string; emoji: string };
}

const pair = (
  wordA: string,
  emojiA: string,
  wordB: string,
  emojiB: string
): MinimalPair => ({
  id: `par:${wordA}-${wordB}`,
  a: { word: wordA, emoji: emojiA },
  b: { word: wordB, emoji: emojiB },
});

// Pares mínimos: dos palabras que se diferencian en un solo sonido.
// Conviene grabarlos con una voz real (carpeta public/audio).
export const MINIMAL_PAIRS: MinimalPair[] = [
  pair("rana", "🐸", "lana", "🧶"),
  pair("pato", "🦆", "gato", "🐱"),
  pair("casa", "🏠", "taza", "☕"),
  pair("sopa", "🍲", "ropa", "👕"),
  pair("pino", "🌲", "vino", "🍷"),
  pair("queso", "🧀", "beso", "💋"),
  pair("mano", "✋", "mono", "🐒"),
  pair("oso", "🐻", "ojo", "👁️"),
  pair("dado", "🎲", "dedo", "☝️"),
  pair("toro", "🐂", "loro", "🦜"),
  pair("sal", "🧂", "sol", "☀️"),
  pair("pollo", "🍗", "gallo", "🐓"),
  pair("rosa", "🌹", "ropa", "👕"),
  pair("lata", "🥫", "rata", "🐀"),
  pair("mapa", "🗺️", "papa", "🥔"),
  pair("cabra", "🐐", "cobra", "🐍"),
];
