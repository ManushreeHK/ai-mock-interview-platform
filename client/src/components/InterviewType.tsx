import { Briefcase, MessageSquare, Code2 } from "lucide-react";
import clsx from "clsx";

type InterviewTypeProps = {
  value: string;
  onChange: (value: string) => void;
};

const interviewTypes = [
  {
    id: "technical",
    title: "Technical",
    description: "DSA, System Design, Frontend, Backend",
    icon: Briefcase,
  },
  {
    id: "behavioral",
    title: "Behavioral",
    description: "HR, Leadership, Communication",
    icon: MessageSquare,
  },
  {
    id: "coding",
    title: "Coding",
    description: "Live coding with compiler",
    icon: Code2,
  },
];

export default function InterviewType({
  value,
  onChange,
}: InterviewTypeProps) {
  return (
    <div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {interviewTypes.map((type) => {
          const Icon = type.icon;

          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={clsx(
                "min-h-11 rounded-2xl border p-5 text-left transition-all duration-200 sm:p-6",
                value === type.id
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
              )}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Icon
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {type.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
