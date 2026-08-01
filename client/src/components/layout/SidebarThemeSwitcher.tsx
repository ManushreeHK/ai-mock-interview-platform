import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "../../theme/useTheme";
import type { AppearancePreference } from "../../utils/settings";
import {
  getSidebarThemeLabel,
  isSidebarThemeSelected,
  selectSidebarTheme,
  sidebarThemePreferences,
} from "../../utils/sidebarTheme";

const icons: Record<AppearancePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function SidebarThemeSwitcher() {
  const { themePreference, resolvedTheme, setThemePreference } = useTheme();

  return (
    <fieldset className="border-t border-slate-200 px-4 py-2.5 dark:border-slate-700">
      <legend className="sr-only">Appearance</legend>
      <div
        className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-950"
        aria-label="Appearance"
      >
        {sidebarThemePreferences.map((preference) => {
          const Icon = icons[preference];
          const selected = isSidebarThemeSelected(themePreference, preference);
          const tooltip = getSidebarThemeLabel(preference, resolvedTheme);

          return (
            <button
              key={preference}
              type="button"
              aria-label={`Use ${preference} theme`}
              aria-pressed={selected}
              title={tooltip}
              onClick={() => selectSidebarTheme(preference, setThemePreference)}
              className={`flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold capitalize outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                selected
                  ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{preference === "system" ? "Auto" : preference}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 truncate text-center text-xs text-slate-500 dark:text-slate-400">
        {themePreference === "system"
          ? `System · ${resolvedTheme === "dark" ? "Dark" : "Light"}`
          : `${themePreference[0].toUpperCase()}${themePreference.slice(1)}`}
      </p>
    </fieldset>
  );
}
