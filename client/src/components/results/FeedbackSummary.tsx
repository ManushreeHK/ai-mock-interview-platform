import ImprovementsCard from "./ImprovementsCard";
import StrengthsCard from "./StrengthsCard";

type FeedbackSummaryProps = {
  strengths: string[];
  improvements: string[];
};

export default function FeedbackSummary({
  strengths,
  improvements,
}: FeedbackSummaryProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Feedback summary
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Key takeaways from your interview performance
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <StrengthsCard strengths={strengths} />
        <ImprovementsCard improvements={improvements} />
      </div>
    </section>
  );
}
