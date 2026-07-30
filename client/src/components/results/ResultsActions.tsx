import { ArrowLeft, Plus } from "lucide-react";

type ResultsActionsProps = {
  onBackToDashboard: () => void;
  onNewInterview: () => void;
};

export default function ResultsActions({
  onBackToDashboard,
  onNewInterview,
}: ResultsActionsProps) {
  return (
    <section className="flex flex-col gap-3 border-t border-slate-200 pt-7 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onBackToDashboard}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
      <button
        type="button"
        onClick={onNewInterview}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        <Plus size={18} />
        Start New Interview
      </button>
    </section>
  );
}
