import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { InterviewAnswer } from "../../types/interview";

import InterviewHeader from "../../components/interview/InterviewHeader";
import InterviewProgress from "../../components/interview/InterviewProgress";
import InterviewTimer from "../../components/interview/InterviewTimer";
import QuestionCard from "../../components/interview/QuestionCard";
import RecordingSection from "../../components/interview/RecordingSection";
import InterviewNavigation from "../../components/interview/InterviewNavigation";

import { useInterview } from "../../hooks/useInterview";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { useTimer } from "../../hooks/useTimer";

import api from "../../services/api";

function appendRecognizedSpeech(answer: string, transcript: string) {
  const recognizedSpeech = transcript.trim();

  if (!recognizedSpeech) return answer;

  return answer.trim()
    ? `${answer.trimEnd()} ${recognizedSpeech}`
    : recognizedSpeech;
}

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingBaseAnswer, setRecordingBaseAnswer] = useState("");
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


const submitInterview = useCallback(async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  stopListening();

  try {
    const finalAnswers = [...answers];

    if (isListening) {
      finalAnswers[currentQuestion] = {
        ...finalAnswers[currentQuestion],
        answer: appendRecognizedSpeech(
          recordingBaseAnswer,
          transcript
        ),
      };
    }

    const response = await api.post("/interview/evaluate", {
      type: interviewDetails?.interviewType,
      role: interviewDetails?.role,
      experience: interviewDetails?.experience,
      difficulty: interviewDetails?.difficulty,
      language: interviewDetails?.language,
      questions: finalAnswers.map((item) => item.question),
      answers: finalAnswers.map((item) => item.answer),
    });

    navigate("/results", {
      state: {
        result: response.data.result,
      },
    });
  } catch (error) {
    console.error("Interview submission failed:", error);
    alert("Unable to evaluate the interview. Please try again.");
    setIsSubmitting(false);
  }
}, [
  answers,
  currentQuestion,
  transcript,
  interviewDetails,
    isSubmitting,
    isListening,
    recordingBaseAnswer,
  navigate,
  stopListening,
]);

const handleTimeUp = useCallback(() => {
  void submitInterview();
}, [submitInterview]);

  const { minutes, seconds } = useTimer({
    duration: 1200,
    resetKey: 0,
    onTimeUp: handleTimeUp,
  });

  useEffect(() => {
    clearTranscript();
  }, [currentQuestion, clearTranscript]);

  if (!questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-10 text-center shadow-xl">
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

  const currentAnswer = isListening
    ? appendRecognizedSpeech(recordingBaseAnswer, transcript)
    : answers[currentQuestion].answer;

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

  const handleStartRecording = () => {
    setRecordingBaseAnswer(answers[currentQuestion].answer);
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();

    setAnswers((prev) => {
      const updated = [...prev];

      updated[currentQuestion] = {
        ...updated[currentQuestion],
        answer: appendRecognizedSpeech(
          recordingBaseAnswer,
          transcript
        ),
      };

      return updated;
    });

    clearTranscript();
  };

  const handlePrevious = () => {
    stopListening();
    previousQuestion();
  };

  const handleNext = () => {
    stopListening();
    nextQuestion();
  };

const handleFinish = () => {
  void submitInterview();
};

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-10 shadow-xl">

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
  current={currentQuestion + 1}
  total={questions.length}
/>

<div className="mt-4">
  <QuestionCard
    question={questions[currentQuestion]}
  />
</div>

        <RecordingSection
          answer={currentAnswer}
          isListening={isListening}
          onAnswerChange={handleAnswerChange}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
        />

      <InterviewNavigation
  currentQuestion={currentQuestion}
  totalQuestions={questions.length}
  onPrevious={handlePrevious}
  onNext={handleNext}
  onFinish={handleFinish}
  isSubmitting={isSubmitting}
/>

      </div>
    </div>
  );
}

export default InterviewPage;
