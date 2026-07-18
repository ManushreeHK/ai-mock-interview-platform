import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import InterviewHeader from "../../components/interview/InterviewHeader";
import InterviewNavigation from "../../components/interview/InterviewNavigation";
import InterviewProgress from "../../components/interview/InterviewProgress";
import InterviewTimer from "../../components/interview/InterviewTimer";
import QuestionCard from "../../components/interview/QuestionCard";
import RecordingSection from "../../components/interview/RecordingSection";

import { useInterview } from "../../hooks/useInterview";
import { useTimer } from "../../hooks/useTimer";

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const questions: string[] = location.state?.questions || [];

  const interviewDetails = location.state?.interviewDetails;

  const {
    currentQuestion,
    nextQuestion,
    previousQuestion,
  } = useInterview(questions.length);

const handleTimeUp = useCallback(() => {
  if (currentQuestion < questions.length - 1) {
    nextQuestion();
  } else {
    alert("🎉 Interview Completed!");
  }
}, [currentQuestion, questions.length, nextQuestion]);

 const { minutes, seconds } = useTimer({
  duration: 120,
  resetKey: currentQuestion,
  onTimeUp: handleTimeUp,
})

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            No Interview Found
          </h2>

          <p className="text-gray-500 mb-6">
            Please create an interview first.
          </p>

          <button
            onClick={() => navigate("/create-interview")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Create Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10">

        {/* Header */}

        <div className="flex justify-between items-center mb-10">

          <InterviewHeader
            role={interviewDetails?.role || "Developer"}
          />

          <InterviewTimer
            minutes={minutes}
            seconds={seconds}
          />

        </div>

        {/* Progress */}

        <InterviewProgress
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
        />

        {/* Question */}

        <QuestionCard
          currentQuestion={currentQuestion}
          question={questions[currentQuestion]}
        />

        {/* Recording */}

        <RecordingSection />

        {/* Navigation */}

        <InterviewNavigation
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          onPrevious={() => {
            previousQuestion();
          }}
          onNext={() => {
            nextQuestion();
          }}
          onFinish={() => {
            alert("🎉 Interview Completed!");
          }}
        />

      </div>

    </div>
  );
}

export default InterviewPage;