type RecordingSectionProps = {
  answer: string;
  isListening: boolean;
  onAnswerChange: (value: string) => void;
  onStart: () => void;
  onStop: () => void;
};

function RecordingSection({
  answer,
  isListening,
  onAnswerChange,
  onStart,
  onStop,
}: RecordingSectionProps) {
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-bold">
        Your Answer
      </h2>

      <div className="mb-6 flex gap-3">
        {isListening ? (
          <button
            onClick={onStop}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            🛑 Stop Recording
          </button>
        ) : (
          <button
            onClick={onStart}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            🎤 Start Recording
          </button>
        )}
      </div>

      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Click Start Recording and begin speaking..."
        className="min-h-[180px] w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-5 text-lg leading-8 text-gray-800 outline-none focus:border-blue-500"
      />

      {isListening && (
        <div className="mt-4 flex items-center gap-2 font-semibold text-red-600">
          <span className="h-3 w-3 animate-pulse rounded-full bg-red-600"></span>
          Listening...
        </div>
      )}
    </div>
  );
}

export default RecordingSection;