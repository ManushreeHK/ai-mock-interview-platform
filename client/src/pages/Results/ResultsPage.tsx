import { useLocation, useNavigate } from "react-router-dom";
import FeedbackSummary from "../../components/results/FeedbackSummary";
import QuestionFeedbackList from "../../components/results/QuestionFeedbackList";
import ResultsActions from "../../components/results/ResultsActions";
import ResultsHero from "../../components/results/ResultsHero";
import ScoreOverview from "../../components/results/ScoreOverview";
import type { SavedInterviewResult } from "../../types/evaluation";

type ResultsLocationState = {
  result?: SavedInterviewResult;
};

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } =
    (location.state as ResultsLocationState | null) ?? {};

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900">
            No results found
          </h2>
          <p className="mt-2 text-slate-500">
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
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:py-10">
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
          onBackToDashboard={() => navigate("/dashboard")}
          onNewInterview={() => navigate("/create-interview")}
        />
      </div>
    </main>
  );
}

export default ResultsPage;
