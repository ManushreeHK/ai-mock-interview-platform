import { FileText, Mic, Square } from "lucide-react";
import Button from "../ui/Button";

type RecordingSectionProps = {
  answer: string;
  isListening: boolean;
  onAnswerChange: (value: string) => void;
  onStart: () => void;
  onStop: () => void;
  voiceEnabled?: boolean;
};

export default function RecordingSection({
  answer,
  isListening,
  onAnswerChange,
  onStart,
  onStop,
  voiceEnabled = true,
}: RecordingSectionProps) {
  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <FileText size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your Answer
            </h2>

            <p className="text-sm text-slate-500">
              {voiceEnabled
                ? "Record your response or edit the transcript manually."
                : "Enter your response manually. Voice input is disabled."}
            </p>
          </div>
        </div>

        {!voiceEnabled ? (
          <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
            Voice input disabled in Settings
          </span>
        ) : isListening ? (
          <Button
            type="button"
            variant="danger"
            leftIcon={<Square size={17} />}
            onClick={onStop}
          >
            Stop Recording
          </Button>
        ) : (
          <Button
            type="button"
            leftIcon={<Mic size={18} />}
            onClick={onStart}
          >
            Start Recording
          </Button>
        )}
      </div>

      <textarea
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        placeholder="Click Start Recording and begin speaking..."
        className="mt-6 min-h-44 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

      {isListening && (
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-600">
          <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />
          Listening...
        </div>
      )}
    </section>
  );
}
