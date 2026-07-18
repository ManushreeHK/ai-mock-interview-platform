type InterviewNavigationProps = {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
};

function InterviewNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFinish,
}: InterviewNavigationProps) {
  return (
    <div className="flex justify-between mt-10">

      <button
        disabled={currentQuestion === 0}
        onClick={onPrevious}
        className="bg-gray-200 px-6 py-3 rounded-lg disabled:opacity-40"
      >
        Previous
      </button>

      {currentQuestion === totalQuestions - 1 ? (
        <button
          onClick={onFinish}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Finish Interview
        </button>
      ) : (
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Next →
        </button>
      )}

    </div>
  );
}

export default InterviewNavigation;