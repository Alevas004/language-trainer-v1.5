import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/hook/useSettings";
import { audioFileFor, audioUrl } from "@/utils/audioPath";
import { recordingExists } from "@/utils/recordings";

interface SpeakOptions {
  /** Nombre de archivo dentro de public/audio/ (si no se da, se deduce del texto) */
  file?: string;
}

/** Prefiere español latino: es-MX, luego es-419, es-US y otras variantes de América */
const pickSpanishVoice = (): SpeechSynthesisVoice | undefined => {
  const voices = window.speechSynthesis
    .getVoices()
    .map((voice) => ({ voice, lang: voice.lang.replace("_", "-") }));
  const order = ["es-MX", "es-419", "es-US"];
  for (const lang of order) {
    const found = voices.find((v) => v.lang === lang);
    if (found) return found.voice;
  }
  const latin = voices.find(
    (v) => v.lang.startsWith("es") && v.lang !== "es-ES"
  );
  return (latin ?? voices.find((v) => v.lang.startsWith("es")))?.voice;
};

// Quién está hablando ahora, para callarlo cuando otro botón empieza a leer
let stopCurrent: (() => void) | null = null;

/**
 * Lee un texto en voz alta.
 * 1) Si existe una grabación real en public/audio/, la reproduce.
 * 2) Si no, usa la voz del navegador en español latino.
 */
export const useSpeech = () => {
  const { settings } = useSettings();
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0); // invalida peticiones antiguas si llega una nueva

  const stop = useCallback(() => {
    requestRef.current += 1;
    audioRef.current?.pause();
    audioRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speakWithVoice = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-MX";
      const voice = pickSpanishVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = settings.speechRate;
      utterance.volume = settings.volume;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [settings.speechRate, settings.volume]
  );

  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}) => {
      stopCurrent?.();
      stop();
      stopCurrent = stop;
      const requestId = requestRef.current;
      setSpeaking(true);

      const url = audioUrl(options.file ?? audioFileFor(text));
      const hasRecording = await recordingExists(url);
      if (requestId !== requestRef.current) return; // llegó otra petición

      if (hasRecording) {
        const audio = new Audio(url);
        audio.volume = settings.volume;
        audio.onended = () => setSpeaking(false);
        audioRef.current = audio;
        try {
          await audio.play();
          return;
        } catch {
          // Si falla la reproducción, se usa la voz del navegador
        }
      }
      if (requestId === requestRef.current) speakWithVoice(text);
    },
    [settings.volume, speakWithVoice, stop]
  );

  // Al cerrar la pantalla, se calla
  useEffect(() => stop, [stop]);

  return { speak, stop, speaking };
};
