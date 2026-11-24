export interface Story {
  id: string;
  steps: { emoji: string; text: string }[]; // tres viñetas en orden
}

const story = (id: string, a: [string, string], b: [string, string], c: [string, string]): Story => ({
  id: `h:${id}`,
  steps: [a, b, c].map(([emoji, text]) => ({ emoji, text })),
});

// Historietas de tres viñetas
export const STORIES: Story[] = [
  story("planta", ["🌱", "Ana planta una semilla"], ["💧", "Ana riega la planta"], ["🌸", "La planta tiene una flor"]),
  story("pastel", ["🥣", "Mamá mezcla los ingredientes"], ["🔥", "Mamá hornea el pastel"], ["🎂", "Todos comen pastel"]),
  story("lluvia", ["☁️", "El cielo se pone gris"], ["🌧️", "Empieza a llover"], ["🌈", "Sale el arcoíris"]),
  story("mañana", ["⏰", "Luis se despierta"], ["🪥", "Luis se lava los dientes"], ["🎒", "Luis va a la escuela"]),
  story("helado", ["🍦", "Compro un helado"], ["☀️", "Hace mucho calor"], ["😋", "Me como el helado"]),
  story("pollito", ["🥚", "La gallina pone un huevo"], ["🐣", "El huevo se abre"], ["🐥", "Nace un pollito"]),
  story("carta", ["✏️", "Sofía escribe una carta"], ["📬", "Sofía la echa al buzón"], ["📨", "Su abuela recibe la carta"]),
  story("baño", ["🛁", "Pablo llena la bañera"], ["🧼", "Pablo se baña con jabón"], ["🧺", "Pablo se seca con la toalla"]),
];

export interface ConnectorItem {
  id: string;
  sentence: string; // "___" es el hueco
  answer: string;
  options: string[]; // incluye la respuesta
}

const c = (sentence: string, answer: string, others: string): ConnectorItem => ({
  id: `c:${answer}:${sentence.slice(0, 14)}`,
  sentence,
  answer,
  options: [answer, ...others.split(",")],
});

// Conectores causales, temporales y de oposición. Cada frase tiene
// una sola opción que tiene sentido.
export const CONNECTORS: ConnectorItem[] = [
  c("Me duele la barriga ___ comí demasiado.", "porque", "pero,mientras"),
  c("Quiero ir al cine, ___ no tengo dinero.", "pero", "porque,entonces"),
  c("Primero me lavo las manos, ___ como.", "luego", "pero,porque"),
  c("Llegué temprano ___ salí de casa a tiempo.", "porque", "pero,mientras"),
  c("Ana estudió mucho, ___ sacó una buena nota.", "entonces", "pero,porque"),
  c("Hoy es mi cumpleaños, ___ estoy muy feliz.", "por eso", "pero,cuando"),
  c("Me gusta el helado ___ el chocolate.", "y", "pero,porque"),
  c("No puedo jugar ___ tengo que hacer la tarea.", "porque", "aunque,entonces"),
  c("Se cayó, ___ se levantó otra vez.", "pero", "porque,por eso"),
];

export interface TenseItem {
  id: string;
  sentence: string;
  answer: string;
  options: string[];
}

const t = (sentence: string, answer: string, others: string): TenseItem => ({
  id: `t:${answer}`,
  sentence,
  answer,
  options: [answer, ...others.split(",")],
});

// El marcador de tiempo (ayer, ahora, mañana) deja una sola respuesta posible
export const TENSES: TenseItem[] = [
  t("Ayer Ana ___ al cine.", "fue", "va,irá"),
  t("Ahora mi papá ___ en la cocina.", "cocina", "cocinó,cocinará"),
  t("Mañana nosotros ___ a la playa.", "iremos", "fuimos,íbamos"),
  t("El año pasado yo ___ a una escuela nueva.", "entré", "entro,entraré"),
  t("Anoche ___ mucho en mi ciudad.", "llovió", "llueve,lloverá"),
  t("En este momento los niños ___ en el parque.", "juegan", "jugaron,jugarán"),
  t("La próxima semana mi tía ___ a visitarnos.", "vendrá", "vino,venía"),
  t("Ayer mi hermano ___ un dibujo muy bonito.", "pintó", "pinta,pintará"),
  t("Dentro de un rato ustedes ___ el postre.", "comerán", "comieron,comían"),
  t("Hace un momento el gato ___ sobre la mesa.", "saltó", "salta,saltará"),
];
