import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type ResolvedTheme } from "./ThemeContext";
import {
  applyResolvedTheme,
  defaultSettings,
  getSystemPrefersDark,
  loadSettings,
  persistSettings,
  resolveDarkTheme,
  subscribeToSystemTheme,
  type AppearancePreference,
  type InterviewAceSettings,
} from "../utils/settings";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark);
  const [status, setStatus] = useState("");
  const resolvedTheme: ResolvedTheme = resolveDarkTheme(settings.appearance, systemDark) ? "dark" : "light";

  useEffect(() => {
    applyResolvedTheme(resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);
  }, [settings.reducedMotion]);

  useEffect(() => {
    return subscribeToSystemTheme(settings.appearance, setSystemDark);
  }, [settings.appearance]);

  function save(next: InterviewAceSettings, message = "Preferences saved.") {
    persistSettings(next);
    setSettings(next);
    setStatus(message);
  }

  function updateSetting<K extends keyof InterviewAceSettings>(key: K, value: InterviewAceSettings[K]) {
    if (key === "appearance" && value === "system") setSystemDark(getSystemPrefersDark());
    save({ ...settings, [key]: value });
  }

  function setThemePreference(preference: AppearancePreference) {
    if (preference === "system") setSystemDark(getSystemPrefersDark());
    updateSetting("appearance", preference);
  }

  function resetToDefaults() {
    setSystemDark(getSystemPrefersDark());
    save({ ...defaultSettings }, "Preferences reset to defaults.");
  }

  const value = {
    settings,
    themePreference: settings.appearance,
    resolvedTheme,
    status,
    setThemePreference,
    updateSetting,
    resetToDefaults,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
