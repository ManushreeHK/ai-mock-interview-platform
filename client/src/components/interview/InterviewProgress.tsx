type InterviewProgressProps = {
  current: number;
  total: number;
};

export default function InterviewProgress({
  current,
  total,
}: InterviewProgressProps) {
  const progress = (current / total) * 100;

  return (
    <div className="flex-1">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Question {current} of {total}
        </h2>

        <span className="text-sm font-medium text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}