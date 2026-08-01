import type { AppearancePreference } from "./settings";
import type { ResolvedTheme } from "../theme/ThemeContext";

export const sidebarThemePreferences: readonly AppearancePreference[] = [
  "light",
  "dark",
  "system",
];

export function isSidebarThemeSelected(
  current: AppearancePreference,
  option: AppearancePreference
) {
  return current === option;
}

export function selectSidebarTheme(
  preference: AppearancePreference,
  setThemePreference: (preference: AppearancePreference) => void
) {
  setThemePreference(preference);
}

export function getSidebarThemeLabel(
  preference: AppearancePreference,
  resolvedTheme: ResolvedTheme
) {
  const name = `${preference[0].toUpperCase()}${preference.slice(1)}`;
  return preference === "system"
    ? `${name} · ${resolvedTheme === "dark" ? "Dark" : "Light"}`
    : name;
}
