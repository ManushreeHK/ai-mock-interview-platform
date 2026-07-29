import { Clock } from "lucide-react";

type InterviewTimerProps = {
  minutes?: number | string;
  seconds?: number | string;
};

export default function InterviewTimer({
  minutes = 20,
  seconds = 0,
}: InterviewTimerProps) {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <div className="rounded-full bg-blue-100 p-2">
        <Clock
          size={20}
          className="text-blue-600"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Remaining Time
        </p>

        <h2 className="text-xl font-bold text-slate-900">
          {formattedMinutes}:{formattedSeconds}
        </h2>
      </div>
    </div>
  );
}