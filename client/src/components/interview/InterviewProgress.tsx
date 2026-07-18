type InterviewProgressProps = {
  currentQuestion: number;
  totalQuestions: number;
};

function InterviewProgress({
  currentQuestion,
  totalQuestions,
}: InterviewProgressProps) {
  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="mb-8">

      <div className="flex justify-between mb-2">

        <span className="font-semibold">
          Progress
        </span>

        <span>
          {currentQuestion + 1} / {totalQuestions}
        </span>

      </div>

      <div className="h-3 bg-gray-200 rounded-full">

        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}

export default InterviewProgress;