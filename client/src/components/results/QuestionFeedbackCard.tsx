import { ChevronDown, MessageSquareText } from "lucide-react";
import type { QuestionEvaluation } from "../../types/evaluation";
import PerformanceBadge from "./PerformanceBadge";
import ProgressBar from "./ProgressBar";

type QuestionFeedbackCardProps = {
  item: QuestionEvaluation;
  index: number;
  answer: string;
  difficulty: string;
};

export default function QuestionFeedbackCard({
  item,
  index,
  answer,
  difficulty,
}: QuestionFeedbackCardProps) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <MessageSquareText size={19} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Question {index + 1}
              </p>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                {difficulty}
              </span>
            </div>
            <h3 className="mt-2 font-semibold leading-6 text-slate-900">
              {item.question}
            </h3>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <PerformanceBadge score={item.score} />
          <ChevronDown
            size={20}
            className="text-slate-400 transition group-open:rotate-180"
          />
        </div>
      </summary>

      <div className="border-t border-slate-100 px-6 pb-6 pt-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-500">
              Question score
            </span>
            <span className="font-bold text-slate-900">
              {item.score}/10
            </span>
          </div>
          <ProgressBar score={item.score} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Your answer
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {answer}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              AI feedback
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.feedback}
            </p>
          </div>
        </div>
      </div>
    </details>
  );
}
