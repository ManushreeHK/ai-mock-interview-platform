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
    <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <summary className="flex cursor-pointer list-none flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300">
            <MessageSquareText size={19} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Question {index + 1}
              </p>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {difficulty}
              </span>
            </div>
            <h3 className="mt-2 font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {item.question}
            </h3>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
          <PerformanceBadge score={item.score} />
          <ChevronDown
            size={20}
            className="text-slate-400 transition group-open:rotate-180"
          />
        </div>
      </summary>

      <div className="border-t border-slate-100 px-4 pb-4 pt-5 dark:border-slate-800 sm:px-6 sm:pb-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-500 dark:text-slate-400">
              Question score
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {item.score}/10
            </span>
          </div>
          <ProgressBar score={item.score} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Your answer
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
              {answer}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              AI feedback
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.feedback}
            </p>
          </div>
        </div>
      </div>
    </details>
  );
}
