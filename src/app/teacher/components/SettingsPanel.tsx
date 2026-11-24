import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import SpeakButton from "@/components/common/SpeakButton";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useProgress } from "@/hook/useProgress";
import { useSettings } from "@/hook/useSettings";
import type { Mode } from "@/types";
import AudioListPanel from "./AudioListPanel";
import "./SettingsPanel.css";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const TEXT_SIZES = [
  { label: "Normal", value: 1 },
  { label: "Grande", value: 1.15 },
  { label: "Muy grande", value: 1.3 },
];

const TIMER_OPTIONS = [30, 60, 90, 120];

// Panel del docente: ajustes del juego y borrado del progreso
const SettingsPanel = ({ open, onClose }: SettingsPanelProps) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { progress, setProfileName, setBossUnlockedByTeacher, resetAll } =
    useProgress();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);

  const handleReset = () => {
    resetAll();
    setConfirmOpen(false);
  };

  return (
    <>
      <Modal open={open} title="Panel del docente" onClose={onClose} wide>
        <div className="settings">
          <section>
            <h3>Perfil</h3>
            <label className="field">
              <span>Grupo o niño</span>
              <input
                type="text"
                maxLength={40}
                placeholder="Por ejemplo: 3.° B"
                value={progress.profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </label>
          </section>

          <section>
            <h3>Voz</h3>
            <label className="field">
              <span>Volumen</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
              />
            </label>
            <div className="field-row">
              <label className="field field-grow">
                <span>Velocidad de la voz</span>
                <input
                  type="range"
                  min={0.6}
                  max={1.1}
                  step={0.05}
                  value={settings.speechRate}
                  onChange={(e) =>
                    updateSettings({ speechRate: Number(e.target.value) })
                  }
                />
              </label>
              <SpeakButton
                text="Hola, soy Señor Loro. ¿Me oyes bien?"
                label="Probar la voz"
              />
            </div>
          </section>

          <section>
            <h3>Pantalla</h3>
            <div className="field">
              <span>Tamaño de letra</span>
              <div className="choice-row">
                {TEXT_SIZES.map((size) => (
                  <Button
                    key={size.value}
                    variant="quiet"
                    aria-pressed={settings.textScale === size.value}
                    onClick={() => updateSettings({ textScale: size.value })}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={settings.wandEnabled}
                onChange={(e) => updateSettings({ wandEnabled: e.target.checked })}
              />
              Usar la varita mágica como cursor
            </label>
          </section>

          <section>
            <h3>Juego</h3>
            <label className="field">
              <span>Modo de juego</span>
              <select
                value={settings.fixedMode ?? ""}
                onChange={(e) =>
                  updateSettings({
                    fixedMode: e.target.value === "" ? null : (e.target.value as Mode),
                  })
                }
              >
                <option value="">Cada niño elige</option>
                <option value="normal">Siempre normal</option>
                <option value="support">Siempre con ayuda extra</option>
              </select>
            </label>

            <label className="check">
              <input
                type="checkbox"
                checked={settings.timerEnabled}
                onChange={(e) => updateSettings({ timerEnabled: e.target.checked })}
              />
              Activar temporizador opcional
            </label>
            <label className="field">
              <span>Duración del temporizador</span>
              <select
                disabled={!settings.timerEnabled}
                value={settings.timerSeconds}
                onChange={(e) =>
                  updateSettings({ timerSeconds: Number(e.target.value) })
                }
              >
                {TIMER_OPTIONS.map((seconds) => (
                  <option key={seconds} value={seconds}>
                    {seconds} segundos
                  </option>
                ))}
              </select>
            </label>
            <p className="note">
              El temporizador nunca quita nada: solo marca el ritmo en las
              actividades donde se pueda usar.
            </p>

            <label className="check">
              <input
                type="checkbox"
                checked={progress.bossUnlockedByTeacher}
                onChange={(e) => setBossUnlockedByTeacher(e.target.checked)}
              />
              Abrir La Gran Página sin completar los cuatro capítulos
            </label>
          </section>

          <section>
            <h3>Voces reales</h3>
            <p className="note">
              Mira qué palabras y frases todavía no tienen grabación y cómo
              nombrar cada archivo.
            </p>
            <div>
              <Button variant="quiet" onClick={() => setAudioOpen(true)}>
                Ver audios pendientes
              </Button>
            </div>
          </section>

          <section className="settings-footer">
            <Button variant="quiet" onClick={resetSettings}>
              Restablecer ajustes
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
              Borrar progreso
            </Button>
          </section>
        </div>
      </Modal>

      <AudioListPanel open={audioOpen} onClose={() => setAudioOpen(false)} />

      <ConfirmModal
        open={confirmOpen}
        title="¿Borrar el progreso?"
        message="Se borrarán todas las páginas completadas y el nombre del perfil. Úsalo, por ejemplo, para empezar con otro grupo. Los ajustes se conservan."
        confirmLabel="Sí, borrar todo"
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default SettingsPanel;
