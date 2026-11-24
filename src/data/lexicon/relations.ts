export interface WordRelation {
  id: string;
  type: "sinonimo" | "antonimo";
  word: string;
  answer: string;
  distractors: string[]; // palabras que claramente no son la respuesta
  sentence: string; // contexto de la palabra
}

const r = (
  type: WordRelation["type"],
  word: string,
  answer: string,
  distractors: string,
  sentence: string
): WordRelation => ({
  id: `r:${type}:${word}`,
  type,
  word,
  answer,
  distractors: distractors.split(","),
  sentence,
});

// Sinónimos y antónimos, siempre dentro de una frase
export const RELATIONS: WordRelation[] = [
  r("sinonimo", "levantar", "alzar", "dormir,comer,pintar", "Mario va a levantar la caja."),
  r("sinonimo", "hablar", "conversar", "correr,saltar,mirar", "Ana quiere hablar con su amiga."),
  r("sinonimo", "bonito", "lindo", "feo,pesado,frío", "El jardín está muy bonito."),
  r("sinonimo", "enorme", "gigante", "pequeño,delgado,lento", "El elefante es enorme."),
  r("sinonimo", "rápido", "veloz", "lento,suave,viejo", "El guepardo es rápido."),
  r("sinonimo", "contento", "feliz", "triste,cansado,enojado", "Estoy contento con mi regalo."),
  r("sinonimo", "casa", "hogar", "calle,escuela,tienda", "Mi casa es pequeña y cálida."),
  r("sinonimo", "empezar", "comenzar", "terminar,parar,dormir", "La clase va a empezar."),
  r("sinonimo", "mirar", "observar", "oír,tocar,oler", "Me gusta mirar las estrellas."),
  r("sinonimo", "terminar", "acabar", "empezar,jugar,buscar", "Voy a terminar mi tarea."),
  r("sinonimo", "pequeño", "chico", "grande,alto,fuerte", "Mi perro es pequeño."),
  r("sinonimo", "tirar", "lanzar", "recoger,guardar,abrazar", "Voy a tirar la pelota."),
  r("antonimo", "alto", "bajo", "rojo,dulce,frío", "El edificio es alto."),
  r("antonimo", "día", "noche", "mesa,fruta,libro", "Durante el día hay luz."),
  r("antonimo", "caliente", "frío", "dulce,blando,largo", "La sopa está caliente."),
  r("antonimo", "lleno", "vacío", "rápido,suave,viejo", "El vaso está lleno."),
  r("antonimo", "abrir", "cerrar", "comer,cantar,soñar", "Voy a abrir la ventana."),
  r("antonimo", "subir", "bajar", "mirar,hablar,dormir", "Los niños van a subir la escalera."),
  r("antonimo", "lento", "rápido", "dulce,azul,frío", "El caracol es lento."),
  r("antonimo", "limpio", "sucio", "alto,dulce,corto", "El suelo está limpio."),
  r("antonimo", "feliz", "triste", "alto,limpio,rápido", "La niña está feliz."),
  r("antonimo", "duro", "blando", "alto,rojo,lento", "La piedra es dura."),
  r("antonimo", "cerca", "lejos", "dulce,limpio,blando", "La escuela está cerca de mi casa."),
  r("antonimo", "ganar", "perder", "comer,pintar,mirar", "Quiero ganar el juego."),
];

export interface Analogy {
  id: string;
  a: string;
  b: string;
  c: string;
  answer: string;
  distractors: string[];
}

const an = (a: string, b: string, c: string, answer: string, distractors: string): Analogy => ({
  id: `a:${a}-${c}`,
  a,
  b,
  c,
  answer,
  distractors: distractors.split(","),
});

// Analogías verbales: A es a B como C es a ___
export const ANALOGIES: Analogy[] = [
  an("zapato", "pie", "guante", "mano", "ojo,cabeza,nariz"),
  an("ojo", "ver", "oreja", "oír", "comer,oler,hablar"),
  an("pájaro", "volar", "pez", "nadar", "correr,saltar,dormir"),
  an("día", "sol", "noche", "luna", "árbol,mar,nube"),
  an("lápiz", "escribir", "tijeras", "cortar", "pintar,leer,medir"),
  an("perro", "ladrar", "gato", "maullar", "volar,nadar,cantar"),
  an("cama", "dormir", "silla", "sentarse", "correr,comer,jugar"),
  an("libro", "leer", "música", "escuchar", "mirar,oler,probar"),
  an("carro", "calle", "barco", "mar", "cielo,montaña,casa"),
  an("abeja", "miel", "vaca", "leche", "huevos,lana,pan"),
  an("sombrero", "cabeza", "zapato", "pie", "mano,oreja,codo"),
  an("frío", "invierno", "calor", "verano", "noche,lunes,lluvia"),
];

export interface Polysemy {
  id: string;
  word: string;
  senses: { emoji: string; label: string; sentence: string }[];
}

const poly = (
  word: string,
  a: [string, string, string],
  b: [string, string, string]
): Polysemy => ({
  id: `p:${word}`,
  word,
  senses: [a, b].map(([emoji, label, sentence]) => ({ emoji, label, sentence })),
});

// Palabras con más de un significado, siempre con imagen y frase
export const POLYSEMY: Polysemy[] = [
  poly("banco", ["🪑", "asiento", "Nos sentamos en el banco del parque."], ["🏦", "lugar del dinero", "Mi mamá fue al banco a sacar dinero."]),
  poly("hoja", ["🍃", "hoja de árbol", "Una hoja cayó del árbol."], ["📄", "hoja de papel", "Dibujé una casa en una hoja."]),
  poly("copa", ["🏆", "premio", "El equipo ganó la copa."], ["🌳", "parte de arriba del árbol", "Un pájaro vive en la copa del árbol."]),
  poly("ratón", ["🐭", "animal", "El ratón se escondió en su cueva."], ["🖱️", "del computador", "Muevo el ratón para abrir el juego."]),
  poly("carta", ["✉️", "papel que se envía", "Escribí una carta para mi abuela."], ["🃏", "naipe", "Saqué una carta de la baraja."]),
  poly("diente", ["🦷", "de la boca", "Se me cayó un diente."], ["🧄", "de ajo", "Corta un diente de ajo para la sopa."]),
  poly("vela", ["🕯️", "de cera", "Apagué la vela del pastel."], ["⛵", "del barco", "El viento infló la vela del barco."]),
  poly("planta", ["🌱", "que crece", "Regué la planta del balcón."], ["🦶", "del pie", "Me duele la planta del pie."]),
  poly("mango", ["🥭", "fruta", "Me comí un mango dulce."], ["🍳", "para agarrar", "El mango de la sartén está caliente."]),
  poly("cola", ["🐕", "de un animal", "El perro mueve la cola."], ["🚶", "fila de personas", "Hicimos cola para entrar al cine."]),
  poly("llama", ["🔥", "del fuego", "La llama de la vela se movía."], ["🦙", "animal", "La llama vive en las montañas."]),
  poly("tienda", ["🏪", "donde se compra", "Fui a la tienda a comprar pan."], ["⛺", "de acampar", "Armamos la tienda en el bosque."]),
];
