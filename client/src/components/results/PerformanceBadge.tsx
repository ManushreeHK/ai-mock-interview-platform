interface Props {
  score: number;
}

function PerformanceBadge({ score }: Props) {
  const { badge, color } =
    score >= 9
      ? {
          badge: "🏆 Excellent",
          color: "bg-green-100 text-green-700",
        }
      : score >= 7
      ? {
          badge: "🚀 Very Good",
          color: "bg-blue-100 text-blue-700",
        }
      : score >= 5
      ? {
          badge: "👍 Good",
          color: "bg-yellow-100 text-yellow-700",
        }
      : {
          badge: "📚 Beginner",
          color: "bg-red-100 text-red-700",
        };

  return (
    <div
      className={`inline-flex rounded-full px-5 py-2 font-semibold ${color}`}
    >
      {badge}
    </div>
  );
}

export default PerformanceBadge;