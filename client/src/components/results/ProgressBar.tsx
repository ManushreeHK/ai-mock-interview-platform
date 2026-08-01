interface Props {
  score: number;
}

function ProgressBar({ score }: Props) {
  return (
    <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
      <div
        className="h-3 rounded-full bg-blue-600"
        style={{ width: `${score * 10}%` }}
      />
    </div>
  );
}

export default ProgressBar;
