import { useState } from "react";

export function useInterview(totalQuestions: number) {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return {
    currentQuestion,
    nextQuestion,
    previousQuestion,
  };
}