type InterviewTimerProps = {
  minutes: string;
  seconds: string;
};

function InterviewTimer({
  minutes,
  seconds,
}: InterviewTimerProps) {
  return (
    <div className="text-2xl font-bold text-blue-600">
      ⏱ {minutes}:{seconds}
    </div>
  );
}

export default InterviewTimer;