import {
  ArrowRight,
  Calendar,
  Clock,
  Code2,
  MessageSquare,
  Mic,
} from "lucide-react";
import clsx from "clsx";

type InterviewType = "Technical" | "Behavioral" | "Coding";
type InterviewStatus = "Excellent" | "Good" | "Fair";

type InterviewCardProps = {
  role: string;
  type: InterviewType;
  score: number;
  status: InterviewStatus;
  date: string;
  duration: string;
};

export default function InterviewCard({
  role,
  type,
  score,
  status,
  date,
  duration,
}: InterviewCardProps) {
  const Icon =
    type === "Technical"
      ? Mic
      : type === "Behavioral"
      ? MessageSquare
      : Code2;

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Icon size={28} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {role}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {type} Interview
            </p>

            <div className="mt-4 flex items-center gap-5 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar size={15} />
                {date}
              </div>

              <div className="flex items-center gap-1">
                <Clock size={15} />
                {duration}
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900">
            {score}%
          </p>

          <span
            className={clsx(
              "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
              {
                "bg-green-100 text-green-700":
                  status === "Excellent",

                "bg-blue-100 text-blue-700":
                  status === "Good",

                "bg-amber-100 text-amber-700":
                  status === "Fair",
              }
            )}
          >
            {status}
          </span>

          <button className="mt-6 flex items-center gap-1 text-sm font-medium text-blue-600 transition group-hover:translate-x-1">
            View Report
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}