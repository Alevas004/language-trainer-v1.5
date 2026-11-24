export interface Phrase {
  id: string;
  text: string;
  words: string[];
  emoji: string;
}

const p = (text: string, emoji: string): Phrase => ({
  id: `f:${text}`,
  text,
  words: text.split(" "),
  emoji,
});

// Frases cortas para contar palabras (conciencia léxica)
export const PHRASES: Phrase[] = [
  // 2 palabras
  p("Llueve mucho", "🌧️"),
  p("Ana canta", "🎤"),
  p("Mamá cocina", "🍳"),
  p("Juan corre", "🏃"),
  // 3 palabras
  p("El gato duerme", "🐱"),
  p("La niña lee", "📖"),
  p("El sol brilla", "☀️"),
  p("Ella toma leche", "🥛"),
  p("Yo pinto flores", "🎨"),
  // 4 palabras
  p("El perro corre rápido", "🐕"),
  p("La abeja vuela alto", "🐝"),
  p("Mi mamá lee cuentos", "📚"),
  p("Los niños juegan fútbol", "⚽"),
  p("El pato nada feliz", "🦆"),
  // 5 palabras
  p("La niña come una manzana", "🍎"),
  p("Mi papá lava el carro", "🚗"),
  p("El elefante bebe agua fría", "🐘"),
  p("Los pájaros cantan en primavera", "🐦"),
  p("Mi abuela tiene un gato", "👵"),
  // 6 palabras
  p("El barco navega por el mar", "🚢"),
  p("La maestra escribe en el tablero", "✏️"),
  p("Los pájaros cantan en el árbol", "🌳"),
];
