export interface PhonWord {
  id: string;
  word: string;
  syllables: string[];
  emoji: string;
  category: string;
}

// "ca-sa" -> palabra "casa" con sus sílabas
const w = (syllables: string, emoji: string, category: string): PhonWord => {
  const parts = syllables.split("-");
  const word = parts.join("");
  return { id: word, word, syllables: parts, emoji, category };
};

// Banco principal: 50 palabras con imagen, sílabas y categoría
export const PHON_WORDS: PhonWord[] = [
  // animales
  w("ga-to", "🐱", "animales"),
  w("pe-rro", "🐶", "animales"),
  w("ca-ba-llo", "🐴", "animales"),
  w("va-ca", "🐄", "animales"),
  w("ra-na", "🐸", "animales"),
  w("pa-to", "🦆", "animales"),
  w("a-be-ja", "🐝", "animales"),
  w("ma-ri-po-sa", "🦋", "animales"),
  w("e-le-fan-te", "🐘", "animales"),
  w("mo-no", "🐒", "animales"),
  w("tor-tu-ga", "🐢", "animales"),
  w("lo-ro", "🦜", "animales"),
  // comida
  w("man-za-na", "🍎", "comida"),
  w("plá-ta-no", "🍌", "comida"),
  w("u-va", "🍇", "comida"),
  w("fre-sa", "🍓", "comida"),
  w("que-so", "🧀", "comida"),
  w("he-la-do", "🍦", "comida"),
  w("ga-lle-ta", "🍪", "comida"),
  w("hue-vo", "🥚", "comida"),
  // objetos
  w("ca-sa", "🏠", "objetos"),
  w("ta-za", "☕", "objetos"),
  w("pe-lo-ta", "⚽", "objetos"),
  w("glo-bo", "🎈", "objetos"),
  w("lla-ve", "🔑", "objetos"),
  w("li-bro", "📖", "objetos"),
  w("re-loj", "⏰", "objetos"),
  w("puer-ta", "🚪", "objetos"),
  w("ca-ma", "🛏️", "objetos"),
  w("cam-pa-na", "🔔", "objetos"),
  w("gui-ta-rra", "🎸", "objetos"),
  w("za-pa-to", "👟", "objetos"),
  w("ca-mi-sa", "👕", "objetos"),
  w("som-bre-ro", "🎩", "objetos"),
  w("co-ro-na", "👑", "objetos"),
  // transportes
  w("ca-rro", "🚗", "transportes"),
  w("bi-ci-cle-ta", "🚲", "transportes"),
  w("a-vión", "✈️", "transportes"),
  w("bar-co", "🚢", "transportes"),
  w("mo-to", "🏍️", "transportes"),
  // naturaleza
  w("sol", "☀️", "naturaleza"),
  w("lu-na", "🌙", "naturaleza"),
  w("es-tre-lla", "⭐", "naturaleza"),
  w("nu-be", "☁️", "naturaleza"),
  w("flor", "🌸", "naturaleza"),
  w("ár-bol", "🌳", "naturaleza"),
  // cuerpo
  w("o-jo", "👁️", "cuerpo"),
  w("o-re-ja", "👂", "cuerpo"),
  w("na-riz", "👃", "cuerpo"),
  w("bo-ca", "👄", "cuerpo"),
];
