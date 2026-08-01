import { User } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useInterviewMetrics } from "../../hooks/useInterviewMetrics";
import {
  getProfileDisplayName,
  getProfileInitials,
} from "../../utils/profileDropdown";

export default function ProfilePage() {
  const profile = useCurrentUser();
  const { metrics, isLoading, error } = useInterviewMetrics();
  const displayName = getProfileDisplayName(
    profile.displayName,
    profile.email
  );
  const initials = getProfileInitials(displayName);
  const metricCards = [
    ["Total interviews", metrics?.totalInterviews ?? 0],
    ["Average score", `${metrics?.averageScore ?? 0}/10`],
    ["Best score", `${metrics?.bestScore ?? 0}/10`],
    ["Current streak", `${metrics?.currentStreak ?? 0} days`],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Profile
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Your profile
        </h1>
        <p className="mt-2 text-slate-600">
          Review your account details and interview progress.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={`${displayName} profile`}
              className="h-20 w-20 rounded-full object-cover shadow-md"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-xl font-bold text-white shadow-md">
              {initials || <User aria-hidden="true" />}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold text-slate-900">
              {displayName}
            </h2>
            <p className="truncate text-slate-500">{profile.email}</p>
            <p className="mt-2 text-sm text-slate-500">
              Authenticated account managed by Amazon Cognito
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="profile-progress-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="profile-progress-heading"
            className="text-xl font-bold text-slate-900"
          >
            Interview progress
          </h2>
          {isLoading && (
            <span className="text-sm text-slate-500">Loading…</span>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {error}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {isLoading ? "—" : value}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
