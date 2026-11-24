import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  AUDIO_GROUP_LABELS,
  buildAudioList,
  type AudioGroup,
} from "@/data/audioList";
import { recordingFileExists } from "@/utils/recordings";
import "./AudioListPanel.css";

interface AudioListPanelProps {
  open: boolean;
  onClose: () => void;
}

const GROUPS: AudioGroup[] = ["pares", "palabras", "frases", "reglas"];

// Lista de grabaciones: qué archivos faltan en public/audio/ y cómo se llaman
const AudioListPanel = ({ open, onClose }: AudioListPanelProps) => {
  const entries = useMemo(() => buildAudioList(), []);
  const [found, setFound] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Al abrir, comprueba qué grabaciones ya existen (de a pocas a la vez)
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < entries.length; i += 8) {
        const chunk = entries.slice(i, i + 8);
        const results = await Promise.all(chunk.map((e) => recordingFileExists(e.file)));
        if (cancelled) return;
        setFound((prev) => ({
          ...prev,
          ...Object.fromEntries(chunk.map((e, k) => [e.file, results[k]])),
        }));
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [open, entries]);

  const checked = Object.keys(found).length;
  const pending = entries.filter((e) => found[e.file] === false);

  const copyPending = async () => {
    const text = pending.map((e) => `${e.file}\t${e.text}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso para copiar: el docente puede seleccionar la lista a mano
    }
  };

  return (
    <Modal open={open} title="Audios pendientes" onClose={onClose} wide>
      <p className="audio-intro">
        Para usar una voz real, graba cada palabra o frase y guárdala en{" "}
        <code>public/audio/</code> con el nombre exacto que aparece aquí. Si no hay
        grabación, el juego usa la voz del navegador.
      </p>
      <div className="audio-summary">
        <span>
          {checked < entries.length
            ? `Revisando… ${checked} de ${entries.length}`
            : `Faltan ${pending.length} de ${entries.length} grabaciones`}
        </span>
        <Button variant="quiet" disabled={pending.length === 0} onClick={copyPending}>
          {copied ? "¡Copiado!" : "Copiar lista de pendientes"}
        </Button>
      </div>
      {GROUPS.map((group) => {
        const items = entries.filter((e) => e.group === group);
        return (
          <section key={group} className="audio-group">
            <h3>{AUDIO_GROUP_LABELS[group]}</h3>
            <ul>
              {items.map((entry) => (
                <li key={entry.file} className={found[entry.file] ? "audio-ok" : ""}>
                  <span className="audio-state" aria-hidden="true">
                    {found[entry.file] === undefined ? "…" : found[entry.file] ? "✓" : "○"}
                  </span>
                  <span className="audio-text">{entry.text}</span>
                  <code>{entry.file}</code>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </Modal>
  );
};

export default AudioListPanel;
