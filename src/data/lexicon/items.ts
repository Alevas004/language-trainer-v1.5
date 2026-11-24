export interface LexItem {
  id: string;
  word: string;
  syllables: string[];
  emoji: string;
  category: string;
  clue: string; // pista para el "veo veo"
  use: string; // para qué sirve o qué hace
}

const i = (
  syllables: string,
  emoji: string,
  category: string,
  clue: string,
  use: string
): LexItem => {
  const parts = syllables.split("-");
  const word = parts.join("");
  return { id: `l:${word}`, word, syllables: parts, emoji, category, clue, use };
};

export interface Category {
  id: string;
  group: string; // nombre del grupo ("Animales")
  singular: string; // "un animal"
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "animales", group: "Animales", singular: "un animal", emoji: "🐾" },
  { id: "frutas", group: "Frutas", singular: "una fruta", emoji: "🍎" },
  { id: "comidas", group: "Comidas", singular: "una comida", emoji: "🍽️" },
  { id: "ropa", group: "Ropa", singular: "una prenda de ropa", emoji: "👕" },
  { id: "transportes", group: "Transportes", singular: "un medio de transporte", emoji: "🚦" },
  { id: "instrumentos", group: "Instrumentos", singular: "un instrumento musical", emoji: "🎶" },
  { id: "escuela", group: "Escuela", singular: "un objeto de la escuela", emoji: "🏫" },
  { id: "naturaleza", group: "Naturaleza", singular: "algo de la naturaleza", emoji: "🌿" },
  { id: "casa", group: "La casa", singular: "algo de la casa", emoji: "🏠" },
];

// Banco principal: 50 ítems con imagen, categoría, pista y función
export const LEX_ITEMS: LexItem[] = [
  // animales
  i("ji-ra-fa", "🦒", "animales", "Tiene el cuello muy largo.", "Come hojas de los árboles altos."),
  i("del-fín", "🐬", "animales", "Vive en el mar y salta sobre las olas.", "Nada y juega cerca de los barcos."),
  i("bú-ho", "🦉", "animales", "Tiene ojos grandes y duerme de día.", "Caza de noche."),
  i("pin-güi-no", "🐧", "animales", "Vive en el hielo y camina muy graciosito.", "Nada para atrapar peces."),
  i("ce-bra", "🦓", "animales", "Tiene rayas negras y blancas.", "Corre en grupo por la sabana."),
  i("pul-po", "🐙", "animales", "Tiene ocho brazos y vive en el mar.", "Se esconde entre las rocas."),
  i("tor-tu-ga", "🐢", "animales", "Camina muy despacio y lleva su casa encima.", "Se mete en su caparazón para protegerse."),
  // frutas
  i("fre-sa", "🍓", "frutas", "Es roja, pequeña y tiene semillitas por fuera.", "Se come sola o con crema."),
  i("u-va", "🍇", "frutas", "Crece en racimos y es morada o verde.", "Con ella se hace jugo."),
  i("san-dí-a", "🍉", "frutas", "Es verde por fuera y roja por dentro.", "Se come en trozos cuando hace calor."),
  i("pi-ña", "🍍", "frutas", "Tiene hojas puntiagudas arriba y piel áspera.", "Se come en rodajas y se hace jugo."),
  i("li-món", "🍋", "frutas", "Es amarillo y muy ácido.", "Se exprime para hacer limonada."),
  i("ce-re-za", "🍒", "frutas", "Es roja, pequeña y tiene un rabito.", "Se pone sobre los pasteles."),
  // comidas
  i("pan", "🍞", "comidas", "Lo hacen en la panadería.", "Se come con mantequilla o con queso."),
  i("que-so", "🧀", "comidas", "Se hace con leche y tiene un color amarillo.", "Se pone en la arepa o en el pan."),
  i("he-la-do", "🍦", "comidas", "Es frío y se derrite con el calor.", "Se come con cuchara o en cono."),
  i("ga-lle-ta", "🍪", "comidas", "Es dulce, redonda y crujiente.", "Se come con leche."),
  i("hue-vo", "🥚", "comidas", "Lo ponen las gallinas y tiene cáscara.", "Se cocina frito o revuelto."),
  // ropa
  i("ca-mi-sa", "👕", "ropa", "Tiene mangas y se pone en el cuerpo.", "Se usa para cubrir el pecho y los brazos."),
  i("pan-ta-lón", "👖", "ropa", "Tiene dos piernas y bolsillos.", "Se usa para cubrir las piernas."),
  i("ves-ti-do", "👗", "ropa", "Es de una sola pieza y tiene falda.", "Se usa en las fiestas."),
  i("bu-fan-da", "🧣", "ropa", "Es larga y suave.", "Se enrolla en el cuello cuando hace frío."),
  i("guan-tes", "🧤", "ropa", "Hay cinco dedos en cada uno.", "Se usan para abrigar las manos."),
  i("go-rra", "🧢", "ropa", "Tiene una visera adelante.", "Se usa para proteger la cabeza del sol."),
  // transportes
  i("ca-rro", "🚗", "transportes", "Tiene cuatro ruedas y cabe en un garaje.", "Lleva a la familia por la calle."),
  i("bi-ci-cle-ta", "🚲", "transportes", "Tiene dos ruedas y pedales.", "Se mueve cuando pedaleas."),
  i("a-vión", "✈️", "transportes", "Tiene alas y vuela muy alto.", "Lleva gente de un país a otro."),
  i("bar-co", "🚢", "transportes", "Flota sobre el agua.", "Cruza el mar con pasajeros."),
  i("tren", "🚆", "transportes", "Va sobre rieles y tiene muchos vagones.", "Lleva pasajeros de una ciudad a otra."),
  i("bus", "🚌", "transportes", "Es muy grande, con muchas ventanas y asientos para mucha gente.", "Lleva a muchas personas por la ciudad."),
  // instrumentos
  i("gui-ta-rra", "🎸", "instrumentos", "Tiene seis cuerdas y un hueco en el centro.", "Se toca con los dedos para cantar."),
  i("tam-bor", "🥁", "instrumentos", "Es redondo y suena cuando lo golpeas.", "Se toca con dos palillos."),
  i("trom-pe-ta", "🎺", "instrumentos", "Es dorada y suena muy fuerte.", "Se toca soplando."),
  i("vio-lín", "🎻", "instrumentos", "Tiene cuerdas y se apoya en el hombro.", "Se toca con un arco."),
  i("pia-no", "🎹", "instrumentos", "Tiene teclas blancas y negras.", "Se toca con los dedos."),
  // escuela
  i("lá-piz", "✏️", "escuela", "Es largo, tiene punta y una goma.", "Sirve para escribir y dibujar."),
  i("li-bro", "📖", "escuela", "Tiene muchas hojas con letras.", "Sirve para leer cuentos y aprender."),
  i("re-gla", "📏", "escuela", "Es larga, plana y tiene números.", "Sirve para medir y hacer rayas rectas."),
  i("mo-chi-la", "🎒", "escuela", "Se lleva en la espalda.", "Sirve para guardar y cargar los cuadernos."),
  i("ti-je-ras", "✂️", "escuela", "Tienen dos hojas que se cruzan.", "Sirven para cortar papel."),
  // naturaleza
  i("sol", "☀️", "naturaleza", "Está en el cielo y da luz y calor.", "Ilumina el día."),
  i("lu-na", "🌙", "naturaleza", "Sale de noche y cambia de forma.", "Alumbra la noche."),
  i("es-tre-lla", "⭐", "naturaleza", "Brilla en el cielo de noche.", "Nos recuerda lo lejos que está el cielo."),
  i("nu-be", "☁️", "naturaleza", "Es blanca o gris y flota en el cielo.", "De ella cae la lluvia."),
  i("flor", "🌸", "naturaleza", "Tiene pétalos de colores y huele rico.", "Atrae a las abejas."),
  i("ár-bol", "🌳", "naturaleza", "Tiene tronco, ramas y hojas.", "Da sombra y frutos."),
  // casa
  i("ca-ma", "🛏️", "casa", "Tiene un colchón y almohadas.", "Sirve para dormir."),
  i("puer-ta", "🚪", "casa", "Se abre y se cierra con una manija.", "Sirve para entrar y salir."),
  i("lla-ve", "🔑", "casa", "Es pequeña, de metal y tiene dientes.", "Sirve para abrir la cerradura."),
  i("re-loj", "⏰", "casa", "Tiene números y agujas, o suena para despertarte.", "Sirve para saber la hora."),
];
