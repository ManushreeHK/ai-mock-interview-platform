import { MessageSquare } from "lucide-react";

type QuestionCardProps = {
  question: string;
};

export default function QuestionCard({
  question,
}: QuestionCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-3">
          <MessageSquare
            size={22}
            className="text-blue-600"
          />
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Current Question
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
            AI Interview Question
          </h2>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800 sm:p-6">
        <p className="break-words text-base leading-7 text-slate-800 dark:text-slate-200 sm:text-lg sm:leading-8">
          {question}
        </p>
      </div>

    </div>
  );
}
