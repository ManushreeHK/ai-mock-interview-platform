type PerformanceBadgeProps = {
  score: number;
};

export default function PerformanceBadge({
  score,
}: PerformanceBadgeProps) {
  const { label, color } =
    score >= 9
      ? {
          label: "Excellent",
          color: "bg-emerald-100 text-emerald-700",
        }
      : score >= 7
        ? {
            label: "Very good",
            color: "bg-blue-100 text-blue-700",
          }
        : score >= 5
          ? {
              label: "Good",
              color: "bg-amber-100 text-amber-700",
            }
          : {
              label: "Keep practicing",
              color: "bg-rose-100 text-rose-700",
            };

  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${color}`}
    >
      {label}
    </span>
  );
}
