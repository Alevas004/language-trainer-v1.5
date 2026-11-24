import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Settings } from "@/types";
import { SETTINGS_KEY, loadJSON, saveJSON } from "@/utils/storage";

export const DEFAULT_SETTINGS: Settings = {
  volume: 1,
  speechRate: 0.85, // un poco más lenta que lo normal, para niños
  textScale: 1,
  timerEnabled: false, // sin cronómetro por defecto
  timerSeconds: 60,
  fixedMode: null,
  wandEnabled: true,
};

export interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULT_SETTINGS,
    ...loadJSON<Partial<Settings>>(SETTINGS_KEY, {}),
  }));

  // Guarda y aplica el tamaño de letra a toda la interfaz
  useEffect(() => {
    saveJSON(SETTINGS_KEY, settings);
    document.documentElement.style.setProperty(
      "--text-scale",
      String(settings.textScale)
    );
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
