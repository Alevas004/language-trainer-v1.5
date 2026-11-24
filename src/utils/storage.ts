// Acceso seguro a localStorage (puede fallar en modo privado o sin permisos)

export const PROGRESS_KEY = "language-trainer:progress";
export const SETTINGS_KEY = "language-trainer:settings";

export const loadJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const saveJSON = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Si no se puede guardar, el juego sigue funcionando sin persistencia
  }
};

export const removeKey = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nada que hacer
  }
};
