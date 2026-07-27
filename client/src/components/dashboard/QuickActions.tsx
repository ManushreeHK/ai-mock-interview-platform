import {
  ArrowRight,
  Mic,
  MessageSquare,
  Code2,
  FileText,
} from "lucide-react";

const actions = [
  {
    title: "Technical Interview",
    subtitle: "Start Practice",
    icon: Mic,
    active: true,
  },
  {
    title: "Behavioral Interview",
    subtitle: "Start Practice",
    icon: MessageSquare,
    active: true,
  },
  {
    title: "Coding Challenge",
    subtitle: "Coming Soon",
    icon: Code2,
    active: false,
  },
  {
    title: "Resume Review",
    subtitle: "Coming Soon",
    icon: FileText,
    active: false,
  },
];

export default function QuickActions() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div
              key={action.title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Icon size={28} />
              </div>

              <h3 className="text-lg font-semibold">
                {action.title}
              </h3>

              <p className="mt-2 text-slate-500">
                {action.subtitle}
              </p>

              {action.active && (
                <div className="mt-6 flex items-center gap-2 font-medium text-blue-600">
                  Start
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}