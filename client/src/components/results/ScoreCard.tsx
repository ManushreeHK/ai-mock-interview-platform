import type { IconType } from "react-icons";

interface ScoreCardProps {
  title: string;
  score: number;
  color: string;
  icon: IconType;
}

function ScoreCard({
  title,
  score,
  color,
  icon: Icon,
}: ScoreCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className={`text-5xl ${color}`}>
        <Icon />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-700">
        {title}
      </h3>

      <p className={`mt-4 text-5xl font-bold ${color}`}>
        {score}
        <span className="text-2xl">/10</span>
      </p>

    </div>
  );
}

export default ScoreCard;