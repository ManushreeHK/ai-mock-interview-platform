type InterviewHeaderProps = {
  role: string;
};

function InterviewHeader({ role }: InterviewHeaderProps) {
  return (
    <div className="min-w-0">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 sm:text-3xl lg:text-4xl">
          InterviewAce AI
        </h1>

        <p className="mt-2 break-words text-gray-500 dark:text-slate-400">
          {role} Mock Interview
        </p>
      </div>

    </div>
  );
}

export default InterviewHeader;
