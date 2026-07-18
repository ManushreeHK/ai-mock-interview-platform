type InterviewHeaderProps = {
  role: string;
};

function InterviewHeader({ role }: InterviewHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          InterviewAce AI
        </h1>

        <p className="text-gray-500 mt-2">
          {role} Mock Interview
        </p>
      </div>

    </div>
  );
}

export default InterviewHeader;