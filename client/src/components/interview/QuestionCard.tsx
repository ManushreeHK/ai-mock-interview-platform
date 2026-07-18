type QuestionCardProps = {
  question: string;
  currentQuestion: number;
};

function QuestionCard({
  question,
  currentQuestion,
}: QuestionCardProps) {
  return (
    <div className="border rounded-xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        Question {currentQuestion + 1}
      </h2>

      <p className="text-xl leading-8">
        {question}
      </p>

    </div>
  );
}

export default QuestionCard;