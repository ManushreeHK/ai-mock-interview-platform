import { Clock, Mic, Moon, SlidersHorizontal } from "lucide-react";

const settings = [
  {
    icon: Moon,
    title: "Theme preference",
    value: "System default",
    description: "Choose light, dark, or system appearance.",
  },
  {
    icon: SlidersHorizontal,
    title: "Default difficulty",
    value: "Not set",
    description: "Preselect a difficulty for new interviews.",
  },
  {
    icon: Clock,
    title: "Default duration",
    value: "20 minutes",
    description: "Configure an interview duration preference.",
  },
  {
    icon: Mic,
    title: "Voice preference",
    value: "Browser default",
    description: "Choose speech input defaults.",
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Coming Soon
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">
          Personal preferences will be configurable here in a future update.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {settings.map(({ icon: Icon, title, value, description }) => (
          <section
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <span className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
                <button
                  type="button"
                  disabled
                  className="mt-4 min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500 disabled:cursor-not-allowed"
                >
                  {value}
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
