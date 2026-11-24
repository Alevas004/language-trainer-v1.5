/**
 * Convierte un texto en el nombre de archivo de su grabación.
 * Palabras sueltas:  public/audio/pala.mp3
 * Frases:            public/audio/frases/el-nino-juega-en-el-parque.mp3
 * La ñ se escribe "ny" para no confundir "año" (anyo) con "ano".
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/ñ/g, "ny")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Ruta relativa dentro de public/audio/ (por ejemplo "frases/hola-lia.mp3") */
export const audioFileFor = (text: string): string => {
  const folder = /\s/.test(text.trim()) ? "frases/" : "";
  return `${folder}${slugify(text)}.mp3`;
};

export const audioUrl = (file: string): string =>
  `${import.meta.env.BASE_URL}audio/${file}`;
