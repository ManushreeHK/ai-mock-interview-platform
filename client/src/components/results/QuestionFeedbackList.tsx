import type { QuestionEvaluation } from "../../types/evaluation";
import QuestionFeedbackCard from "./QuestionFeedbackCard";

type QuestionFeedbackListProps = {
  questions: QuestionEvaluation[];
  answers: string[];
  difficulty: string;
};

export default function QuestionFeedbackList({
  questions,
  answers,
  difficulty,
}: QuestionFeedbackListProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Question feedback
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Detailed feedback for each interview response
      </p>

      <div className="mt-5 space-y-4">
        {questions.map((item, index) => (
          <QuestionFeedbackCard
            key={`${item.question}-${index}`}
            item={item}
            index={index}
            answer={answers[index] || "No answer provided"}
            difficulty={difficulty}
          />
        ))}
      </div>
    </section>
  );
}
