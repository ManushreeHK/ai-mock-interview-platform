import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import Button from "../ui/Button";

type InterviewNavigationProps = {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  isSubmitting?: boolean;
};

export default function InterviewNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFinish,
  isSubmitting = false,
}: InterviewNavigationProps) {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion =
    currentQuestion === totalQuestions - 1;

  return (
    <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-semibold text-slate-900">
          Question {currentQuestion + 1} of {totalQuestions}
        </h3>

        <p className="text-sm text-slate-500">
          You can review your answers before submitting.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          leftIcon={<ArrowLeft size={18} />}
          disabled={isFirstQuestion || isSubmitting}
          onClick={onPrevious}
        >
          Previous
        </Button>

        {!isLastQuestion && (
          <Button
            type="button"
            rightIcon={<ArrowRight size={18} />}
            disabled={isSubmitting}
            onClick={onNext}
          >
            Next Question
          </Button>
        )}

        {isLastQuestion && (
          <Button
            type="button"
            variant="danger"
            leftIcon={<CheckCircle size={18} />}
            disabled={isSubmitting}
            onClick={onFinish}
          >
            {isSubmitting
              ? "Evaluating..."
              : "Finish Interview"}
          </Button>
        )}
      </div>
    </div>
  );
}