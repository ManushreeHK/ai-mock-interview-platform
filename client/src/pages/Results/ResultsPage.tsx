import { useLocation, useNavigate } from "react-router-dom";
import type { InterviewResult } from "../../types/interview";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state as InterviewResult;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="mb-2 text-4xl font-bold">
          Interview Summary
        </h1>

        <p className="mb-8 text-gray-500">
          Role: {data.interviewDetails.role}
        </p>

        {data.answers.map((item, index) => (
          <div
            key={index}
            className="mb-8 rounded-xl border border-gray-200 p-6"
          >
            <h2 className="mb-3 text-xl font-bold">
              Question {index + 1}
            </h2>

            <p className="mb-5 font-medium">
              {item.question}
            </p>

            <div className="rounded-lg bg-gray-100 p-4">
              {item.answer ? (
                item.answer
              ) : (
                <span className="italic text-gray-400">
                  Not answered
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsPage;