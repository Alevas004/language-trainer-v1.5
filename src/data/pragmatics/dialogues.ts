import type { Speaker } from "@/types/exercises";

export type CharacterId = "lia" | "tortuga" | "zorro";

export interface Character {
  id: CharacterId;
  name: string;
  short: string; // cómo se nombra dentro de una frase ("la profesora Tortuga")
  emoji: string;
  register: "informal" | "formal";
}

// Cada personaje habla a su manera
export const CHARACTERS: Record<CharacterId, Character> = {
  lia: { id: "lia", name: "Lía la ardilla", short: "Lía", emoji: "🐿️", register: "informal" },
  tortuga: { id: "tortuga", name: "Profesora Tortuga", short: "la profesora Tortuga", emoji: "🐢", register: "formal" },
  zorro: { id: "zorro", name: "Don Zorro, el tendero", short: "Don Zorro", emoji: "🦊", register: "formal" },
};

export const FACES = {
  alegre: { emoji: "😊", tone: "con voz alegre" },
  triste: { emoji: "😢", tone: "con voz triste" },
  enojada: { emoji: "😠", tone: "con voz enojada" },
  sorprendida: { emoji: "😮", tone: "con voz sorprendida" },
  pensativa: { emoji: "🤔", tone: "con voz tranquila, pensando" },
  amable: { emoji: "🙂", tone: "con voz amable" },
} as const;

export type FaceId = keyof typeof FACES;

export const speakerOf = (id: CharacterId, face: FaceId): Speaker => ({
  name: CHARACTERS[id].name,
  emoji: CHARACTERS[id].emoji,
  expression: FACES[face].emoji,
  tone: FACES[face].tone,
});

// ---------- Nivel 1: intención comunicativa ----------

export const INTENTS: Record<string, string> = {
  saludar: "Saludar",
  pedir: "Pedir algo",
  agradecer: "Dar las gracias",
  despedirse: "Despedirse",
  informar: "Contar algo",
  disculparse: "Pedir perdón",
  preguntar: "Hacer una pregunta",
  felicitar: "Felicitar",
  ofrecer: "Ofrecer ayuda",
  quejarse: "Quejarse",
  invitar: "Invitar a jugar",
};

export interface IntentItem {
  id: string;
  who: CharacterId;
  face: FaceId;
  line: string;
  intent: string;
  others: string[]; // otras intenciones que NO corresponden
}

const it = (
  who: CharacterId,
  face: FaceId,
  line: string,
  intent: string,
  others: string
): IntentItem => ({
  id: `i:${intent}:${line.slice(0, 12)}`,
  who,
  face,
  line,
  intent,
  others: others.split(","),
});

export const INTENT_ITEMS: IntentItem[] = [
  it("lia", "alegre", "¡Hola! ¡Buenos días!", "saludar", "despedirse,pedir,quejarse"),
  it("lia", "amable", "¿Me prestas tu borrador, por favor?", "pedir", "agradecer,felicitar,despedirse"),
  it("lia", "alegre", "¡Muchas gracias por ayudarme!", "agradecer", "pedir,quejarse,preguntar"),
  it("tortuga", "alegre", "Hasta mañana, niños. ¡Que descansen!", "despedirse", "saludar,pedir,quejarse"),
  it("zorro", "amable", "Hoy tengo pan recién hecho.", "informar", "pedir,despedirse,quejarse"),
  it("lia", "triste", "Perdón, no quise romper tu dibujo.", "disculparse", "felicitar,invitar,saludar"),
  it("tortuga", "pensativa", "¿Quién sabe cuánto es dos más dos?", "preguntar", "despedirse,agradecer,quejarse"),
  it("lia", "sorprendida", "¡Felicidades, ganaste el concurso!", "felicitar", "quejarse,pedir,despedirse"),
  it("zorro", "amable", "¿En qué te puedo ayudar?", "ofrecer", "quejarse,despedirse,disculparse"),
  it("lia", "enojada", "¡No me gusta que tomes mis cosas sin permiso!", "quejarse", "saludar,felicitar,invitar"),
  it("lia", "alegre", "¿Quieres jugar conmigo?", "invitar", "quejarse,despedirse,disculparse"),
  it("tortuga", "amable", "Por favor, guarden silencio.", "pedir", "saludar,felicitar,agradecer"),
];

// ---------- Nivel 2: adaptarse al interlocutor ----------

export interface RegisterItem {
  id: string;
  listener: CharacterId;
  situation: string;
  fits: string; // lo que va bien con ese personaje
  other: string; // lo que va bien con otro personaje, pero no con este
  brusque: string; // demasiado brusco con cualquiera
}

const rg = (
  listener: CharacterId,
  situation: string,
  fits: string,
  other: string,
  brusque: string
): RegisterItem => ({ id: `g:${listener}:${situation.slice(0, 14)}`, listener, situation, fits, other, brusque });

export const REGISTER_ITEMS: RegisterItem[] = [
  rg("tortuga", "Llegas al salón y ves a la Profesora Tortuga. ¿Cómo la saludas?", "Buenos días, profesora.", "¡Qué más, Tortu!", "Ey, tú."),
  rg("lia", "Ves a tu amiga Lía en el recreo. ¿Qué le dices?", "¡Hola, Lía! ¿Jugamos?", "Muy buenos días, distinguida señorita Lía.", "Quítate de ahí."),
  rg("zorro", "Quieres comprar pan en la tienda de Don Zorro.", "Buenas tardes, Don Zorro. ¿Me vende un pan, por favor?", "¡Zorro, dame pan!", "Pan. Ya."),
  rg("tortuga", "Necesitas ir al baño durante la clase.", "Profesora, ¿puedo ir al baño, por favor?", "Voy al baño, ¿ok?", "Me voy y ya."),
  rg("lia", "Quieres que Lía te preste un lápiz.", "Lía, ¿me prestas tu lápiz, por favor?", "Señorita Lía, ¿sería usted tan amable de prestarme su lápiz?", "Dame tu lápiz."),
  rg("zorro", "Quieres saber el precio de una manzana.", "Don Zorro, ¿cuánto cuesta esta manzana?", "Oye, ¿y esto cuánto vale?", "¡Dime ya el precio!"),
  rg("tortuga", "La profesora te explicó algo y lo entendiste.", "Muchas gracias por explicarme, profesora.", "Gracias, Tortu, estuvo chévere.", "Ya era hora."),
  rg("lia", "Sin querer rompiste el juguete de Lía.", "Perdón, Lía, fue sin querer.", "Le ruego que me disculpe, honorable amiga.", "No fue mi culpa."),
  rg("zorro", "Ya compraste y te vas de la tienda.", "Hasta luego, Don Zorro. ¡Gracias!", "¡Chao, Zorro!", "Ya me voy."),
  rg("tortuga", "No entendiste la explicación de la profesora.", "Profesora, ¿me puede explicar otra vez, por favor?", "No entiendo nada, ¿sí?", "Eso no sirve."),
  rg("lia", "Hoy es el cumpleaños de Lía.", "¡Feliz cumpleaños, Lía! ¡Que la pases muy bien!", "Le deseo un feliz cumpleaños, estimada Lía.", "Ah, ya cumpliste."),
  rg("zorro", "Buscas la leche y no la encuentras.", "Don Zorro, ¿me ayuda a encontrar la leche, por favor?", "Oye, ¿y la leche dónde está?", "¡No hay leche aquí!"),
];

// ---------- Niveles 3 y 4: situaciones cotidianas y turnos ----------

export interface ReplyOption {
  text: string;
  reply: string; // cómo reacciona el personaje
}

export interface SituationItem {
  id: string;
  who: CharacterId;
  face: FaceId;
  line: string;
  good: string;
  wrong: ReplyOption[];
}

const sit = (
  who: CharacterId,
  face: FaceId,
  line: string,
  good: string,
  w1: [string, string],
  w2: [string, string]
): SituationItem => ({
  id: `s:${who}:${line.slice(0, 14)}`,
  who,
  face,
  line,
  good,
  wrong: [w1, w2].map(([text, reply]) => ({ text, reply })),
});

export const SITUATIONS: SituationItem[] = [
  sit("zorro", "amable", "¡Buenos días! ¿Qué desea?", "Quisiera dos bananos, por favor.",
    ["Hoy hace mucho calor.", "Ah, sí, hace calor… pero ¿qué te puedo vender?"],
    ["No sé.", "Tómate tu tiempo. ¿Qué te gustaría comprar?"]),
  sit("tortuga", "pensativa", "¿Alguien puede explicar qué es una isla?", "Una isla es tierra rodeada de agua.",
    ["Mi perro se llama Rocky.", "Qué lindo nombre, pero hablábamos de las islas."],
    ["Tengo sed.", "Entiendo. Después tomas agua. Ahora, ¿qué es una isla?"]),
  sit("lia", "triste", "Se me perdió mi muñeca.", "No te preocupes, te ayudo a buscarla.",
    ["Qué bueno.", "Pero estoy triste… Se me perdió mi muñeca."],
    ["Tengo hambre.", "Yo también tengo hambre, pero primero quiero encontrar mi muñeca."]),
  sit("zorro", "amable", "Son tres monedas.", "Aquí tiene. ¡Gracias!",
    ["Mañana te cuento.", "¿Mañana? Ahora necesito que me pagues."],
    ["Qué bonito sombrero.", "Gracias, pero primero las tres monedas, por favor."]),
  sit("tortuga", "amable", "Es hora de guardar los cuadernos.", "Sí, profesora. Ya los guardo.",
    ["No quiero.", "Mmm, hay que guardarlos para poder salir. Intenta otra vez."],
    ["Ayer comí arroz.", "Qué rico, pero ahora hay que guardar los cuadernos."]),
  sit("lia", "alegre", "¡Mira, dibujé un dragón!", "¡Qué lindo! Tiene colores muy bonitos.",
    ["Tengo tarea.", "Ah… yo quería que vieras mi dragón."],
    ["No me importa.", "Uy, eso me puso triste. Quería mostrarte mi dibujo."]),
  sit("zorro", "triste", "Lo siento, ya no tengo pan.", "No hay problema, gracias. Llevaré galletas.",
    ["¡Entonces quiero pan!", "Ya te dije que no tengo, lo siento mucho."],
    ["Adiós.", "¿Ya te vas? ¿No quieres ver otra cosa?"]),
  sit("lia", "alegre", "¿Quieres que juguemos a las escondidas?", "¡Sí, vamos! Yo cuento primero.",
    ["Mañana llueve.", "Mmm, te pregunté si querías jugar."],
    ["El pan está caliente.", "¿El pan? Te pregunté por las escondidas."]),
  sit("tortuga", "pensativa", "¿Terminaste tu tarea?", "Todavía no, profesora. Me falta un poco.",
    ["Sí, mi gato es gris.", "Qué bien por tu gato, pero te pregunté por la tarea."],
    ["Aló.", "No estamos hablando por teléfono. ¿Terminaste la tarea?"]),
  sit("zorro", "sorprendida", "¡Uy, se cayeron las manzanas!", "Yo te ayudo a recogerlas.",
    ["Qué divertido.", "No es divertido, ¡están por todo el piso!"],
    ["Voy a jugar.", "Ahora no es momento de jugar, necesito ayuda."]),
];

export interface TurnItem {
  id: string;
  who: CharacterId;
  face: FaceId;
  line: string;
  good: string;
  jump: string; // cambia de tema de golpe
}

const tn = (who: CharacterId, face: FaceId, line: string, good: string, jump: string): TurnItem => ({
  id: `t:${who}:${line.slice(0, 14)}`,
  who,
  face,
  line,
  good,
  jump,
});

export const TURN_ITEMS: TurnItem[] = [
  tn("lia", "alegre", "Ayer fui al zoológico.", "¡Qué divertido! ¿Qué animal te gustó más?", "Mi tarea es de matemáticas."),
  tn("lia", "alegre", "Tengo un perrito nuevo.", "¡Qué bien! ¿Cómo se llama?", "Me gusta la pizza."),
  tn("tortuga", "pensativa", "Hoy vamos a hablar de los planetas.", "¿Cuál es el planeta más grande?", "¿Qué hay de almuerzo?"),
  tn("zorro", "amable", "Mis manzanas vienen de una granja muy lejana.", "¿Y cómo las traen hasta aquí?", "Quiero un helado."),
  tn("lia", "triste", "Ayer se me cayó el helado.", "¡Uy, qué pena! ¿Te compraron otro?", "Mañana juego fútbol."),
  tn("lia", "alegre", "Mi abuela me enseñó a tejer.", "¡Qué lindo! ¿Qué tejiste?", "Hoy hace mucho calor."),
  tn("tortuga", "sorprendida", "Los delfines duermen con medio cerebro despierto.", "¡Qué curioso! ¿Por qué lo hacen?", "Tengo un lápiz nuevo."),
  tn("lia", "alegre", "Mañana es mi cumpleaños.", "¡Felicidades por adelantado! ¿Harás una fiesta?", "Ayer vi una película."),
  tn("zorro", "alegre", "Esta semana llegaron frutas nuevas.", "¿Cuáles son? Quiero verlas.", "¿Tienes sueño?"),
  tn("lia", "triste", "Me da miedo la oscuridad.", "Te entiendo. ¿Qué te ayuda a sentirte tranquila?", "Me gusta el color azul."),
];

export const DISMISSIVE: ReplyOption[] = [
  { text: "No me importa.", reply: "Mmm, eso no fue muy amable. Intentemos otra vez." },
  { text: "Eso es aburrido.", reply: "Uy, eso me puso un poco triste. Intentemos otra vez." },
];

// ---------- Nivel 5: frases hechas y lenguaje figurado ----------

export interface FigurativeItem {
  id: string;
  who: CharacterId;
  face: FaceId;
  phrase: string;
  real: string; // lo que quiere decir
  literal: string; // lo que diría tomándola al pie de la letra
  extra: string; // otra cosa que no tiene que ver
  emojis: { literal: string; real: string; extra: string };
}

const fg = (
  who: CharacterId,
  face: FaceId,
  phrase: string,
  real: string,
  literal: string,
  extra: string,
  emojis: [string, string, string]
): FigurativeItem => ({
  id: `f:${phrase.slice(0, 16)}`,
  who,
  face,
  phrase,
  real,
  literal,
  extra,
  emojis: { literal: emojis[0], real: emojis[1], extra: emojis[2] },
});

export const FIGURATIVE_ITEMS: FigurativeItem[] = [
  fg("lia", "alegre", "Estoy en las nubes.", "Estoy distraída.", "Estoy sentada sobre una nube.", "Tengo mucho frío.", ["☁️", "🤔", "🥶"]),
  fg("lia", "alegre", "Esa tarea es pan comido.", "Es muy fácil.", "Es un pan que alguien ya se comió.", "Es muy larga.", ["🍞", "😎", "📏"]),
  fg("tortuga", "amable", "Está lloviendo a cántaros.", "Llueve muchísimo.", "Del cielo caen cántaros.", "Llueve muy poquito.", ["🏺", "🌧️", "💧"]),
  fg("lia", "alegre", "Se me hizo agua la boca.", "Me dieron muchas ganas de comer eso.", "Me salió agua de la boca como de una llave.", "Me dolió la boca.", ["🚰", "🤤", "🦷"]),
  fg("lia", "sorprendida", "Tengo mariposas en el estómago.", "Estoy muy nerviosa.", "Hay mariposas dentro de mi barriga.", "Tengo mucha hambre.", ["🦋", "😬", "🍽️"]),
  fg("zorro", "amable", "Ese juguete cuesta un ojo de la cara.", "Es muy caro.", "Hay que dar un ojo para comprarlo.", "Es muy bonito.", ["👁️", "💰", "🧸"]),
  fg("lia", "alegre", "Mi hermano duerme como un tronco.", "Duerme muy profundo.", "Mi hermano es un tronco de madera.", "Duerme muy poco.", ["🪵", "😴", "⏰"]),
  fg("lia", "triste", "Me puse rojo como un tomate.", "Sentí mucha vergüenza.", "Mi cuerpo se volvió un tomate.", "Sentí mucho frío.", ["🍅", "😳", "🥶"]),
  fg("lia", "amable", "¿Me echas una mano?", "¿Me ayudas?", "¿Me tiras una mano?", "¿Me saludas?", ["✋", "🤝", "👋"]),
  fg("tortuga", "amable", "Mi tía habla por los codos.", "Habla muchísimo.", "Mi tía habla con los codos.", "Habla muy bajito.", ["💪", "🗣️", "🤫"]),
  fg("lia", "alegre", "Tengo un hambre de lobo.", "Tengo muchísima hambre.", "Tengo hambre como un lobo de verdad.", "No quiero comer.", ["🐺", "🍽️", "🙅"]),
  fg("zorro", "sorprendida", "Se quedó con la boca abierta.", "Se sorprendió muchísimo.", "Se quedó mucho tiempo con la boca abierta.", "Se puso a cantar.", ["😮", "😲", "🎤"]),
];
