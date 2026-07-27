import InterviewCard from "./InterviewCard";

export default function RecentInterviews() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Interviews
          </h2>

          <p className="text-sm text-slate-500">
            Your latest AI interview sessions
          </p>
        </div>

        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="space-y-5">
        <InterviewCard
          role="Frontend Developer"
          type="Technical"
          score={92}
          status="Excellent"
          date="Yesterday"
          duration="24 min"
        />

        <InterviewCard
          role="React Developer"
          type="Technical"
          score={88}
          status="Good"
          date="Jul 26"
          duration="21 min"
        />

        <InterviewCard
          role="Software Engineer"
          type="Behavioral"
          score={81}
          status="Good"
          date="Jul 24"
          duration="18 min"
        />
      </div>
    </section>
  );
}