import { useEffect, useMemo, useState } from "react";
import RecentInterviews from "../../components/dashboard/RecentInterviews";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsGrid from "../../components/dashboard/StatsGrid";
import WeeklyProgress from "../../components/dashboard/WeeklyProgress";
import AIInsights from "../../components/dashboard/AIInsights";
import QuickActions from "../../components/dashboard/QuickActions";
import Achievements from "../../components/dashboard/Achievements";
import { fetchInterviewHistory } from "../../services/interviewHistory";
import type { InterviewHistoryItem } from "../../types/interview-history";
import { calculateDashboardMetrics } from "../../utils/dashboardMetrics";

function Dashboard() {
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    fetchInterviewHistory()
      .then((items) => {
        if (active) setHistory(items);
      })
      .catch(() => {
        if (active) {
          setHistory([]);
          setError("Interview history is temporarily unavailable.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const metrics = useMemo(
    () => calculateDashboardMetrics(history),
    [history]
  );

  function retryHistory() {
    setIsLoading(true);
    setError("");
    setReloadKey((value) => value + 1);
  }

  return (
    <div className="space-y-8">
      <WelcomeBanner metrics={!isLoading && !error ? metrics : undefined} />

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Loading dashboard"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-3xl bg-slate-200"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-700">{error}</p>
          <button
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            onClick={retryHistory}
          >
            Try Again
          </button>
        </div>
      ) : (
        <StatsGrid metrics={metrics} />
      )}

      {!isLoading && !error && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklyProgress data={metrics.weeklyProgress} />
          </div>
          <AIInsights insights={metrics.insights} />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        {!isLoading && !error && <Achievements metrics={metrics} />}
      </div>

      {!isLoading && !error && (
        <RecentInterviews interviews={history} />
      )}
    </div>
  );
}

export default Dashboard;
