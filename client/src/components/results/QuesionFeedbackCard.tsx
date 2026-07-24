import type { QuestionEvaluation } from "../../types/evaluation";
import PerformanceBadge from "./PerformanceBadge";
import ProgressBar from "./ProgressBar";

interface Props {
  item: QuestionEvaluation;
  index: number;
}

function QuestionFeedbackCard({ item, index }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">
            Question {index + 1}
          </h3>

          <p className="mt-2 text-gray-700">
            {item.question}
          </p>
        </div>

        <PerformanceBadge score={item.score} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">
            Score
          </span>

          <span className="font-bold text-blue-600">
            {item.score}/10
          </span>
        </div>

        <ProgressBar score={item.score} />
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <h4 className="mb-2 font-semibold">
          Feedback
        </h4>

        <p className="leading-7 text-gray-700">
          {item.feedback}
        </p>
      </div>
    </div>
  );
}

export default QuestionFeedbackCard;