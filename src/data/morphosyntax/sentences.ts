export interface Sentence {
  id: string;
  text: string;
  words: string[];
  emoji: string;
  /** Palabras que NO pueden reemplazar a la preposición de la oración (sin ambigüedad) */
  prepDistractors: string[];
}

const s = (text: string, emoji: string, prepDistractors = ""): Sentence => ({
  id: `o:${text}`,
  text,
  words: text.split(" "),
  emoji,
  prepDistractors: prepDistractors ? prepDistractors.split(",") : [],
});

// 50 oraciones con imagen. Las cortas sirven para ordenar; las largas, para
// completar palabras de función. La lista de la derecha son preposiciones
// que NO encajan en la oración (para no tener dos respuestas posibles).
export const SENTENCES: Sentence[] = [
  // cortas (3 y 4 palabras)
  s("El gato duerme", "🐱"),
  s("Ana lee cuentos", "📚"),
  s("Mi papá cocina", "🍳"),
  s("Los pájaros cantan", "🐦"),
  s("La luna brilla", "🌙"),
  s("Yo dibujo flores", "🌸"),
  s("El bebé ríe", "👶"),
  s("La niña come pan", "🍞"),
  s("El perro juega afuera", "🐶"),
  s("Mi abuela teje bufandas", "🧶"),
  s("Los niños juegan fútbol", "⚽"),
  s("El sol sale temprano", "🌅"),
  s("La profesora escribe rápido", "✏️"),
  s("Mi hermano toca guitarra", "🎸"),
  // con palabras de función
  s("El niño juega en el parque", "🛝", "con,de,por"),
  s("La niña lee un libro", "📖"),
  s("Mi mamá compra pan en la tienda", "🏪", "con,de,por"),
  s("El gato duerme sobre la cama", "🛏️", "con,de,para"),
  s("Los niños van a la escuela", "🏫", "de,con,sobre"),
  s("Papá lava el carro en casa", "🚗", "con,de,para"),
  s("La abuela cocina para la familia", "🍲", "sobre,de,en"),
  s("El pájaro vuela sobre el árbol", "🌳", "con,de,para"),
  s("Ana come una manzana roja", "🍎"),
  s("El perro corre tras la pelota", "⚽", "sobre,de"),
  s("La maestra escribe en el tablero", "📝", "con,de,por"),
  s("Los patos nadan en el lago", "🦆", "con,de,para"),
  s("Mi tío viaja en avión", "✈️", "con,de,sobre"),
  s("El barco navega por el mar", "🚢", "con,de,para"),
  s("La niña pinta con un pincel", "🎨", "en,de,por"),
  s("Juan guarda los libros en la mochila", "🎒", "con,de,para"),
  s("Mi hermana toca el piano con cuidado", "🎹", "en,de,por"),
  s("Los niños comen helado en el parque", "🍦", "con,de,para"),
  s("La gallina pone huevos en el nido", "🐔", "con,de,para"),
  s("Mario sube a la montaña con su papá", "⛰️", "de,con"),
  s("El conejo come zanahorias en el jardín", "🐰", "con,de,para"),
  s("Los bomberos apagan el fuego con agua", "🚒", "de,en,por"),
  s("El cartero deja una carta en el buzón", "📬", "con,de,para"),
  s("El pez nada en el agua", "🐟", "con,de,para"),
  s("Yo guardo mis juguetes en la caja", "🧸", "con,de,para"),
  s("Los gatos toman la leche", "🥛"),
  s("Las flores crecen en el jardín", "🌷", "con,de,para"),
  s("El niño abre la puerta", "🚪"),
  s("La mamá prepara una sopa", "🍲"),
  s("Los niños leen unos cuentos", "📚"),
  s("La abeja busca una flor", "🐝"),
  s("Mi papá maneja un camión grande", "🚚"),
  s("La tortuga camina por el camino", "🐢", "con,de"),
  s("El sol calienta la tierra", "☀️"),
  s("La lluvia moja las calles", "🌧️"),
  s("El viento mueve las hojas", "🍃"),
  s("Los peces viven en el mar", "🐠", "con,de,para"),
];

export const NAMES = new Set(["Ana", "Juan", "Mario"]);

export const ARTICLES_DEFINITE = ["el", "la", "los", "las"];
export const ARTICLES_INDEFINITE = ["un", "una", "unos", "unas"];
export const PREPOSITIONS = ["a", "de", "en", "con", "por", "para", "sobre", "tras"];

/** Pasa a minúscula salvo los nombres propios */
export const normalizeWord = (word: string): string =>
  NAMES.has(word) ? word : word.toLowerCase();

export const isArticle = (word: string): boolean =>
  ARTICLES_DEFINITE.includes(word) || ARTICLES_INDEFINITE.includes(word);

export const isPreposition = (word: string): boolean => PREPOSITIONS.includes(word);
