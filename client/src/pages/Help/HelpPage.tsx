import {
  Bug,
  CircleHelp,
  FileText,
  Mail,
  Scale,
} from "lucide-react";

const resources = [
  [CircleHelp, "FAQ", "Answers to common InterviewAce AI questions."],
  [Bug, "Report a Bug", "Bug reporting workflow is coming soon."],
  [Mail, "Contact Support", "Direct support contact is coming soon."],
  [FileText, "Privacy Policy", "The in-app policy page is coming soon."],
  [Scale, "Terms", "The in-app terms page is coming soon."],
] as const;

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Coming Soon
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Help &amp; Support
        </h1>
        <p className="mt-2 text-slate-600">
          Support resources will be available here as the platform grows.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map(([Icon, title, description]) => (
          <section
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
            <button
              type="button"
              disabled
              className="mt-4 min-h-10 rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed"
            >
              Coming Soon
            </button>
          </section>
        ))}
      </div>

      <p className="text-center text-sm text-slate-400">
        InterviewAce AI · Version information coming soon
      </p>
    </div>
  );
}
