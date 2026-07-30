import {
  Brain,
  MessageCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import ScoreCard from "./ScoreCard";

type ScoreOverviewProps = {
  overallScore: number;
  communication: number;
  technicalKnowledge: number;
  confidence: number;
};

export default function ScoreOverview({
  overallScore,
  communication,
  technicalKnowledge,
  confidence,
}: ScoreOverviewProps) {
  return (
    <section>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Score overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          A quick look at your performance across key areas
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard
          label="Overall"
          score={overallScore}
          icon={Trophy}
          tone="blue"
        />
        <ScoreCard
          label="Communication"
          score={communication}
          icon={MessageCircle}
          tone="emerald"
        />
        <ScoreCard
          label="Technical knowledge"
          score={technicalKnowledge}
          icon={Brain}
          tone="amber"
        />
        <ScoreCard
          label="Confidence"
          score={confidence}
          icon={ShieldCheck}
          tone="violet"
        />
      </div>
    </section>
  );
}
