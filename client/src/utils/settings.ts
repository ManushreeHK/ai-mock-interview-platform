export const SETTINGS_STORAGE_KEY = "interviewace.settings.v1";

export type AppearancePreference = "light" | "dark" | "system";
export type DefaultDifficulty = "" | "Easy" | "Medium" | "Hard";
export type DefaultInterviewType = "technical" | "behavioral";

export type InterviewAceSettings = {
  appearance: AppearancePreference;
  defaultDifficulty: DefaultDifficulty;
  defaultInterviewType: DefaultInterviewType;
  voiceInputEnabled: boolean;
  reducedMotion: boolean;
  confirmBeforeLeavingInterview: boolean;
};

export const defaultSettings: InterviewAceSettings = Object.freeze({
  appearance: "system",
  defaultDifficulty: "",
  defaultInterviewType: "technical",
  voiceInputEnabled: true,
  reducedMotion: false,
  confirmBeforeLeavingInterview: true,
});

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseSettings(value: unknown): InterviewAceSettings {
  if (!isRecord(value)) return { ...defaultSettings };

  const appearance = ["light", "dark", "system"].includes(
    String(value.appearance)
  )
    ? (value.appearance as AppearancePreference)
    : defaultSettings.appearance;
  const defaultDifficulty = ["", "Easy", "Medium", "Hard"].includes(
    String(value.defaultDifficulty)
  )
    ? (value.defaultDifficulty as DefaultDifficulty)
    : defaultSettings.defaultDifficulty;
  const defaultInterviewType = ["technical", "behavioral"].includes(
    String(value.defaultInterviewType)
  )
    ? (value.defaultInterviewType as DefaultInterviewType)
    : defaultSettings.defaultInterviewType;

  return {
    appearance,
    defaultDifficulty,
    defaultInterviewType,
    voiceInputEnabled:
      typeof value.voiceInputEnabled === "boolean"
        ? value.voiceInputEnabled
        : defaultSettings.voiceInputEnabled,
    reducedMotion:
      typeof value.reducedMotion === "boolean"
        ? value.reducedMotion
        : defaultSettings.reducedMotion,
    confirmBeforeLeavingInterview:
      typeof value.confirmBeforeLeavingInterview === "boolean"
        ? value.confirmBeforeLeavingInterview
        : defaultSettings.confirmBeforeLeavingInterview,
  };
}

export function loadSettings(
  storage: Pick<StorageLike, "getItem"> = localStorage
) {
  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? parseSettings(JSON.parse(raw) as unknown) : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export function persistSettings(
  settings: InterviewAceSettings,
  storage: Pick<StorageLike, "setItem"> = localStorage
) {
  storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function resetSettings(
  storage: Pick<StorageLike, "removeItem"> = localStorage
) {
  storage.removeItem(SETTINGS_STORAGE_KEY);
  return { ...defaultSettings };
}

export function resolveDarkTheme(
  appearance: AppearancePreference,
  systemPrefersDark: boolean
) {
  return appearance === "dark" ||
    (appearance === "system" && systemPrefersDark);
}

export function getSystemPrefersDark(
  matchMedia: typeof window.matchMedia | undefined =
    typeof window === "undefined" ? undefined : window.matchMedia
) {
  return matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function applyResolvedTheme(
  dark: boolean,
  root: Pick<HTMLElement, "classList" | "dataset" | "style"> =
    document.documentElement
) {
  root.classList.toggle("dark", dark);
  root.dataset.theme = dark ? "dark" : "light";
  root.style.colorScheme = dark ? "dark" : "light";
}

export function applySettingsToDocument(
  settings: InterviewAceSettings,
  root: Pick<HTMLElement, "classList" | "dataset" | "style"> =
    document.documentElement,
  systemPrefersDark = getSystemPrefersDark()
) {
  const dark = resolveDarkTheme(settings.appearance, systemPrefersDark);
  applyResolvedTheme(dark, root);
  root.classList.toggle("reduce-motion", settings.reducedMotion);
}

export function subscribeToSystemTheme(
  preference: AppearancePreference,
  onChange: (prefersDark: boolean) => void,
  matchMedia: typeof window.matchMedia | undefined =
    typeof window === "undefined" ? undefined : window.matchMedia
) {
  if (preference !== "system" || !matchMedia) return () => undefined;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (event: MediaQueryListEvent) => onChange(event.matches);
  media.addEventListener("change", handleChange);
  return () => media.removeEventListener("change", handleChange);
}
