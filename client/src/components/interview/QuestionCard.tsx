import { MessageSquare } from "lucide-react";

type QuestionCardProps = {
  question: string;
};

export default function QuestionCard({
  question,
}: QuestionCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

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

          <h2 className="text-xl font-bold text-slate-900">
            AI Interview Question
          </h2>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl bg-slate-50 p-6">
        <p className="text-lg leading-8 text-slate-800">
          {question}
        </p>
      </div>

    </div>
  );
}