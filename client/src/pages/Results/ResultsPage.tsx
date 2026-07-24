import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaComments,
  FaBrain,
  FaBullseye,
} from "react-icons/fa";

import ScoreCard from "../../components/results/ScoreCard";
import StrengthsCard from "../../components/results/StrengthsCard";
import WeaknessCard from "../../components/results/WeaknessCard";
import QuestionFeedbackCard from "../../components/results/QuesionFeedbackCard";

import type { Evaluation } from "../../types/evaluation";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { interviewDetails, evaluation } = location.state || {};

  if (!evaluation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-10 shadow-lg text-center">
          <h2 className="text-3xl font-bold">
            No Results Found
          </h2>

          <button
            onClick={() => navigate("/create-interview")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Create Interview
          </button>
        </div>
      </div>
    );
  }

  const report: Evaluation =
    typeof evaluation === "string"
      ? JSON.parse(
          evaluation
            .replace("```json", "")
            .replace("```", "")
            .trim()
        )
      : evaluation;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-10 shadow-xl">

        {/* Header */}

        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Interview Report
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            {interviewDetails.role} • {interviewDetails.experience}
          </p>
        </div>

        {/* Score Cards */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <ScoreCard
            title="Overall"
            score={report.overallScore}
            color="text-blue-600"
            icon={FaTrophy}
          />

          <ScoreCard
            title="Communication"
            score={report.communication}
            color="text-green-600"
            icon={FaComments}
          />

          <ScoreCard
            title="Technical"
            score={report.technicalKnowledge}
            color="text-yellow-500"
            icon={FaBrain}
          />

          <ScoreCard
            title="Confidence"
            score={report.confidence}
            color="text-purple-600"
            icon={FaBullseye}
          />

        </div>

        {/* Strengths */}

        <div className="mt-14">
          <StrengthsCard
            strengths={report.strengths}
          />
        </div>

        {/* Weaknesses */}

        <div className="mt-14">
          <WeaknessCard
            weaknesses={report.weaknesses}
          />
        </div>

        {/* Question Feedback */}

        <div className="mt-16">

          <h2 className="mb-8 text-3xl font-bold">
            Question-wise Feedback
          </h2>

          <div className="space-y-8">

            {report.questionEvaluation.map((item, index) => (
              <QuestionFeedbackCard
                key={index}
                item={item}
                index={index}
              />
            ))}

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-14 flex justify-center gap-6">

          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
          >
            New Interview
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-xl border px-8 py-4 font-semibold hover:bg-gray-100"
          >
            Download Report
          </button>

        </div>

      </div>
    </div>
  );
}

export default ResultsPage;