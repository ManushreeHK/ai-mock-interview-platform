import AccountSection from "../../components/account/AccountSection";
import PreferenceToggle from "../../components/account/PreferenceToggle";
import { useAccountSettings } from "../../hooks/useAccountSettings";
import { useTheme } from "../../theme/useTheme";
import type {
  AppearancePreference,
  DefaultDifficulty,
  DefaultInterviewType,
} from "../../utils/settings";

const selectClasses =
  "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

export default function SettingsPage() {
  const { settings, update, reset, status } = useAccountSettings();
  const { resolvedTheme } = useTheme();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Preferences are saved locally in this browser.</p></div>
        <button type="button" onClick={reset} className="min-h-11 w-fit rounded-xl border border-slate-300 px-4 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">Reset to defaults</button>
      </header>
      <p role="status" className="min-h-5 text-sm font-medium text-emerald-600">{status}</p>

      <AccountSection title="Appearance" description="Theme changes apply immediately across the current browser.">
        <fieldset><legend className="sr-only">Appearance preference</legend><div className="grid gap-3 sm:grid-cols-3">
          {(["light", "dark", "system"] as AppearancePreference[]).map((appearance) => (
            <label key={appearance} className={`cursor-pointer rounded-2xl border p-4 text-center font-semibold capitalize transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-offset-slate-900 ${settings.appearance === appearance ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950" : "border-slate-200 text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:text-slate-300"}`}>
              <input type="radio" name="appearance" checked={settings.appearance === appearance} onChange={() => update("appearance", appearance)} className="sr-only" />{appearance}
              {appearance === "system" && settings.appearance === "system" ? <span className="mt-1 block text-xs font-normal normal-case">Following device setting: {resolvedTheme === "dark" ? "Dark" : "Light"}</span> : null}
            </label>
          ))}
        </div></fieldset>
      </AccountSection>

      <AccountSection title="Interview defaults" description="Applied when you next open the New Interview form.">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="font-medium text-slate-800 dark:text-slate-200">Default difficulty<select value={settings.defaultDifficulty} onChange={(event) => update("defaultDifficulty", event.target.value as DefaultDifficulty)} className={selectClasses}><option value="">No default</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select></label>
          <label className="font-medium text-slate-800 dark:text-slate-200">Default interview type<select value={settings.defaultInterviewType} onChange={(event) => update("defaultInterviewType", event.target.value as DefaultInterviewType)} className={selectClasses}><option value="technical">Technical</option><option value="behavioral">Behavioral</option></select></label>
        </div>
        <p className="mt-4 text-sm text-slate-500">Question count is not configurable because the current generation flow requests 10 questions.</p>
        <div className="mt-5"><PreferenceToggle label="Voice input enabled by default" description="Show browser speech recognition controls during interviews." checked={settings.voiceInputEnabled} onChange={(value) => update("voiceInputEnabled", value)} /></div>
      </AccountSection>

      <AccountSection title="Accessibility and safety"><div className="space-y-4">
        <PreferenceToggle label="Reduce motion" description="Minimize transitions and animations throughout the interface." checked={settings.reducedMotion} onChange={(value) => update("reducedMotion", value)} />
        <PreferenceToggle label="Confirm before leaving an active interview" description="Ask for confirmation before closing or refreshing an interview in progress." checked={settings.confirmBeforeLeavingInterview} onChange={(value) => update("confirmBeforeLeavingInterview", value)} />
      </div></AccountSection>
    </div>
  );
}
