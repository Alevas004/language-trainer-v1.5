import type { ComponentId, LevelNumber, SubcomponentId } from "@/types";

interface SubcomponentInfo {
  id: SubcomponentId;
  name: string; // nombre del subcomponente
  chapter: string; // nombre del capítulo del libro mágico
  numeral: string; // número romano del capítulo
}

interface ComponentInfo {
  id: ComponentId;
  name: string;
  subcomponents: SubcomponentInfo[];
}

// Estructura de la interfaz del docente: componente -> subcomponentes
export const COMPONENTS: ComponentInfo[] = [
  {
    id: "form",
    name: "Forma",
    subcomponents: [
      {
        id: "phonology",
        name: "Fonético-fonológico",
        chapter: "El Bosque de los Sonidos",
        numeral: "I",
      },
      {
        id: "morphosyntax",
        name: "Morfo-sintáctico",
        chapter: "El Taller de las Frases",
        numeral: "II",
      },
    ],
  },
  {
    id: "content",
    name: "Contenido",
    subcomponents: [
      {
        id: "lexicon",
        name: "Léxico-semántico",
        chapter: "El Jardín de las Palabras",
        numeral: "III",
      },
    ],
  },
  {
    id: "use",
    name: "Uso",
    subcomponents: [
      {
        id: "pragmatics",
        name: "Pragmático",
        chapter: "La Plaza de las Conversaciones",
        numeral: "IV",
      },
    ],
  },
];

export const BOSS_CHAPTER = "La Gran Página";

/** Lista plana de los cuatro subcomponentes */
export const SUBCOMPONENTS = COMPONENTS.flatMap((c) => c.subcomponents);
export const SUBCOMPONENT_IDS: SubcomponentId[] = SUBCOMPONENTS.map((s) => s.id);

export const LEVELS: LevelNumber[] = [1, 2, 3, 4, 5];

/**
 * Los juegos están siempre desbloqueados (se pueden jugar en cualquier orden).
 * Dentro de un juego, los niveles se abren de uno en uno porque la dificultad
 * es progresiva. Poner en false para dejar todos los niveles libres.
 */
export const LEVELS_ARE_SEQUENTIAL = true;
