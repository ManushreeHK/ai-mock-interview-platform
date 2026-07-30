import {
  Braces,
  Code2,
  Coffee,
  GraduationCap,
  Layers3,
  Server,
  UserRound,
  Workflow,
} from "lucide-react";

const audiences = [
  ["Frontend Developers", Braces],
  ["Backend Developers", Server],
  ["Full Stack Engineers", Layers3],
  ["Java Developers", Coffee],
  ["React Developers", Code2],
  ["Node.js Developers", Workflow],
  ["Students", GraduationCap],
  ["Experienced Professionals", UserRound],
] as const;

export default function TrustedFor() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/70 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Perfect for
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Practice built around your career path
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {audiences.map(([label, Icon]) => (
            <div
              key={label}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={19} />
              </span>
              <span className="text-sm font-semibold text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
