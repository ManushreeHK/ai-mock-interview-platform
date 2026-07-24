import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { InterviewAnswer } from "../../types/interview";

import InterviewHeader from "../../components/interview/InterviewHeader";
import InterviewNavigation from "../../components/interview/InterviewNavigation";
import InterviewProgress from "../../components/interview/InterviewProgress";
import InterviewTimer from "../../components/interview/InterviewTimer";
import QuestionCard from "../../components/interview/QuestionCard";
import RecordingSection from "../../components/interview/RecordingSection";
import api from "../../services/api";

import { useInterview } from "../../hooks/useInterview";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { useTimer } from "../../hooks/useTimer";

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const questions: string[] = location.state?.questions || [];
  const interviewDetails = location.state?.interviewDetails;

  const [answers, setAnswers] = useState<InterviewAnswer[]>(
    questions.map((question) => ({
      question,
      answer: "",
    }))
  );

  const {
    currentQuestion,
    nextQuestion,
    previousQuestion,
  } = useInterview(questions.length);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition();

  const handleTimeUp = useCallback(() => {
    stopListening();

    if (currentQuestion < questions.length - 1) {
      nextQuestion();
    } else {
      alert("🎉 Interview Completed!");
    }
  }, [
    currentQuestion,
    questions.length,
    stopListening,
    nextQuestion,
  ]);

  const { minutes, seconds } = useTimer({
    duration: 120,
    resetKey: currentQuestion,
    onTimeUp: handleTimeUp,
  });

  // Save answer continuously while user speaks
  // Clear ONLY live transcript when question changes
useEffect(() => {
  clearTranscript();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentQuestion]);



  if (!questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-10 shadow-xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            No Interview Found
          </h2>

          <p className="mb-6 text-gray-500">
            Please create an interview first.
          </p>

          <button
            onClick={() => navigate("/create-interview")}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Create Interview
          </button>
        </div>
      </div>
    );
  }

const currentAnswer =
  isListening
    ? transcript
    : answers[currentQuestion].answer;

const handlePrevious = () => {
  stopListening();
  previousQuestion();
};

const handleNext = () => {
  stopListening();
  nextQuestion();
};

const handleFinish = async () => {
  stopListening();

  try {
    const finalAnswers = [...answers];

    finalAnswers[currentQuestion] = {
      ...finalAnswers[currentQuestion],
      answer: transcript || finalAnswers[currentQuestion].answer,
    };

    const response = await api.post("/interview/evaluate", {
      role: interviewDetails.role,
      experience: interviewDetails.experience,
      questions: finalAnswers.map((a) => a.question),
      answers: finalAnswers.map((a) => a.answer),
    });

    console.log("Evaluation Response:", response.data);

    navigate("/results", {
      state: {
        interviewDetails,
        answers: finalAnswers,
        evaluation: response.data.evaluation,
      },
    });
  } catch (error) {
    console.error(error);
    alert("Unable to evaluate interview. Please try again.");
  }
};
const handleAnswerChange = (value: string) => {
  setAnswers((prev) => {
    const updated = [...prev];

    updated[currentQuestion] = {
      ...updated[currentQuestion],
      answer: value,
    };

    return updated;
  });
};

const handleStopRecording = () => {
  stopListening();

  setAnswers((prev) => {
    const updated = [...prev];

    updated[currentQuestion] = {
      ...updated[currentQuestion],
      answer: transcript,
    };

    return updated;
  });
};
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 shadow-xl">

        <div className="mb-10 flex items-center justify-between">
          <InterviewHeader
            role={interviewDetails?.role || "Developer"}
          />

          <InterviewTimer
            minutes={minutes}
            seconds={seconds}
          />
        </div>

        <InterviewProgress
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
        />

        <QuestionCard
          currentQuestion={currentQuestion}
          question={questions[currentQuestion]}
        />

       <RecordingSection
  answer={currentAnswer}
  isListening={isListening}
  onAnswerChange={handleAnswerChange}
  onStart={startListening}
  onStop={handleStopRecording}
/>

        <InterviewNavigation
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFinish={handleFinish}
        />

      </div>
    </div>
  );
}

export default InterviewPage;