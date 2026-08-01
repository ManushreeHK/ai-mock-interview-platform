import { useTheme } from "../theme/useTheme";

export function useAccountSettings() {
  const { settings, updateSetting, resetToDefaults, status } = useTheme();
  return { settings, update: updateSetting, reset: resetToDefaults, status };
}
