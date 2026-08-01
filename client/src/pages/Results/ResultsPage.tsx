import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FeedbackSummary from "../../components/results/FeedbackSummary";
import QuestionFeedbackList from "../../components/results/QuestionFeedbackList";
import ResultsActions from "../../components/results/ResultsActions";
import ResultsHero from "../../components/results/ResultsHero";
import ScoreOverview from "../../components/results/ScoreOverview";
import { fetchInterviewHistoryDetail } from "../../services/interviewHistory";
import type { SavedInterviewResult } from "../../types/evaluation";

type ResultsLocationState = {
  result?: SavedInterviewResult;
};

type HistoricalLoadState =
  | { status: "idle" | "loading"; result: null; message: "" }
  | { status: "success"; result: SavedInterviewResult; message: "" }
  | { status: "not-found" | "error"; result: null; message: string };

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { interviewId } = useParams<{ interviewId: string }>();
  const freshResult =
    ((location.state as ResultsLocationState | null) ?? {}).result ?? null;
  const [retryKey, setRetryKey] = useState(0);
  const [historical, setHistorical] = useState<HistoricalLoadState>({
    status: interviewId ? "loading" : "idle",
    result: null,
    message: "",
  });

  function retryHistoricalResult() {
    setHistorical({ status: "loading", result: null, message: "" });
    setRetryKey((value) => value + 1);
  }

  useEffect(() => {
    if (!interviewId) return;
    let active = true;

    fetchInterviewHistoryDetail(interviewId)
      .then((result) => {
        if (active) {
          setHistorical({ status: "success", result, message: "" });
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setHistorical({
            status: "not-found",
            result: null,
            message: "This interview result could not be found.",
          });
          return;
        }

        setHistorical({
          status: "error",
          result: null,
          message: "The saved interview is temporarily unavailable.",
        });
      });

    return () => {
      active = false;
    };
  }, [interviewId, retryKey]);

  if (interviewId && historical.status === "loading") {
    return (
      <div
        aria-label="Loading saved interview result"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-blue-950 dark:border-t-blue-400" />
          <p className="mt-4 font-medium text-slate-600 dark:text-slate-300">
            Loading saved results…
          </p>
        </div>
      </div>
    );
  }

  if (
    interviewId &&
    (historical.status === "not-found" || historical.status === "error")
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {historical.status === "not-found"
              ? "Interview not found"
              : "Unable to load results"}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{historical.message}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {historical.status === "error" && (
              <button
                type="button"
                onClick={retryHistoricalResult}
                className="min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="min-h-11 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Back to History
            </button>
          </div>
        </div>
      </div>
    );
  }

  const result = interviewId
    ? historical.status === "success"
      ? historical.result
      : null
    : freshResult;

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            No results found
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Complete an interview to see your report.
          </p>
          <button
            type="button"
            onClick={() => navigate("/create-interview")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Create interview
          </button>
        </div>
      </div>
    );
  }

  const report = result.evaluation;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <ResultsHero
          role={result.role}
          interviewType={result.type}
          difficulty={result.difficulty}
          overallScore={report.overallScore}
        />

        <ScoreOverview
          overallScore={report.overallScore}
          communication={report.communication}
          technicalKnowledge={report.technicalKnowledge}
          confidence={report.confidence}
        />

        <FeedbackSummary
          strengths={report.strengths}
          improvements={report.weaknesses}
        />

        <QuestionFeedbackList
          questions={report.questionEvaluation}
          answers={result.answers}
          difficulty={result.difficulty}
        />

        <ResultsActions
          onBackToDashboard={() =>
            navigate(interviewId ? "/history" : "/dashboard")
          }
          onNewInterview={() => navigate("/create-interview")}
          backLabel={interviewId ? "Back to History" : "Back to Dashboard"}
        />
      </div>
    </main>
  );
}

export default ResultsPage;
