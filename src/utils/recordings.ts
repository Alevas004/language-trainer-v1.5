import { audioUrl } from "@/utils/audioPath";

// Recuerda qué grabaciones existen para no consultarlas cada vez
const recordingCache = new Map<string, boolean>();

/**
 * Netlify y Vite devuelven index.html (código 200) cuando un archivo no existe.
 * Por eso no basta con "response.ok": se comprueba que sea realmente audio.
 */
export const recordingExists = async (url: string): Promise<boolean> => {
  const cached = recordingCache.get(url);
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(url, { method: "HEAD" });
    const type = res.headers.get("content-type") ?? "";
    const ok =
      res.ok &&
      (type.startsWith("audio/") || type === "application/octet-stream");
    recordingCache.set(url, ok);
    return ok;
  } catch {
    recordingCache.set(url, false);
    return false;
  }
};

/** Comprueba por nombre de archivo dentro de public/audio/ */
export const recordingFileExists = (file: string): Promise<boolean> =>
  recordingExists(audioUrl(file));
