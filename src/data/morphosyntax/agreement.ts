export interface NounForms {
  id: string;
  singular: string;
  plural: string;
  emoji: string;
  gender: "m" | "f";
}

const n = (
  singular: string,
  plural: string,
  emoji: string,
  gender: "m" | "f"
): NounForms => ({ id: `n:${singular}`, singular, plural, emoji, gender });

// Singular y plural (incluye plurales con cambios: lápiz-lápices, ratón-ratones)
export const NOUNS: NounForms[] = [
  n("gato", "gatos", "🐱", "m"),
  n("flor", "flores", "🌸", "f"),
  n("lápiz", "lápices", "✏️", "m"),
  n("pez", "peces", "🐟", "m"),
  n("luz", "luces", "💡", "f"),
  n("casa", "casas", "🏠", "f"),
  n("árbol", "árboles", "🌳", "m"),
  n("carro", "carros", "🚗", "m"),
  n("libro", "libros", "📖", "m"),
  n("mano", "manos", "✋", "f"),
  n("pelota", "pelotas", "⚽", "f"),
  n("reloj", "relojes", "⏰", "m"),
  n("nube", "nubes", "☁️", "f"),
  n("estrella", "estrellas", "⭐", "f"),
  n("león", "leones", "🦁", "m"),
  n("ratón", "ratones", "🐭", "m"),
];

export interface GenderPair {
  id: string;
  male: string;
  female: string;
  malePlural: string;
  femalePlural: string;
  emoji: [string, string];
}

const g = (
  forms: string,
  emojiM: string,
  emojiF: string
): GenderPair => {
  const [male, female, malePlural, femalePlural] = forms.split(",");
  return { id: `g:${male}`, male, female, malePlural, femalePlural, emoji: [emojiM, emojiF] };
};

// Pares de género: el niño / la niña
export const GENDER_PAIRS: GenderPair[] = [
  g("niño,niña,niños,niñas", "👦", "👧"),
  g("gato,gata,gatos,gatas", "🐱", "🐱"),
  g("perro,perra,perros,perras", "🐶", "🐶"),
  g("abuelo,abuela,abuelos,abuelas", "👴", "👵"),
  g("profesor,profesora,profesores,profesoras", "👨‍🏫", "👩‍🏫"),
  g("doctor,doctora,doctores,doctoras", "👨‍⚕️", "👩‍⚕️"),
  g("cocinero,cocinera,cocineros,cocineras", "👨‍🍳", "👩‍🍳"),
  g("hermano,hermana,hermanos,hermanas", "👦", "👧"),
  g("amigo,amiga,amigos,amigas", "👦", "👧"),
  g("vecino,vecina,vecinos,vecinas", "👨", "👩"),
  g("león,leona,leones,leonas", "🦁", "🦁"),
  g("tío,tía,tíos,tías", "👨", "👩"),
];
