type Props = {
  interviewType: string;
  role: string;
  experience: string;
  difficulty: string;
  language: string;
};

export default function InterviewSummary({
  interviewType,
  role,
  experience,
  difficulty,
  language,
}: Props) {
  return (
    <div className="sticky top-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-slate-900">
        Interview Summary
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Your interview configuration
      </p>

      <div className="mt-8 space-y-5">

        <SummaryItem
          label="Interview"
          value={interviewType || "-"}
        />

        <SummaryItem
          label="Role"
          value={role || "-"}
        />

        <SummaryItem
          label="Experience"
          value={experience || "-"}
        />

        <SummaryItem
          label="Difficulty"
          value={difficulty || "-"}
        />

        <SummaryItem
          label="Language"
          value={language || "-"}
        />

      </div>

      <div className="mt-8 rounded-2xl bg-blue-50 p-4">

        <h3 className="font-semibold text-blue-700">
          Estimated Time
        </h3>

        <p className="mt-2 text-3xl font-bold text-blue-700">
          20 mins
        </p>

      </div>

    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-3">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value}
      </span>

    </div>
  );
}