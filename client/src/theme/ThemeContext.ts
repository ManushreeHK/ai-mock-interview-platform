import { createContext } from "react";
import type { AppearancePreference, InterviewAceSettings } from "../utils/settings";

export type ResolvedTheme = "light" | "dark";

export type ThemeContextValue = {
  settings: InterviewAceSettings;
  themePreference: AppearancePreference;
  resolvedTheme: ResolvedTheme;
  status: string;
  setThemePreference: (preference: AppearancePreference) => void;
  updateSetting: <K extends keyof InterviewAceSettings>(key: K, value: InterviewAceSettings[K]) => void;
  resetToDefaults: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
