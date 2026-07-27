
import RecentInterviews from "../../components/dashboard/RecentInterviews";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsGrid from "../../components/dashboard/StatsGrid";
import WeeklyProgress from "../../components/dashboard/WeeklyProgress";
import AIInsights from "../../components/dashboard/AIInsights";
import QuickActions from "../../components/dashboard/QuickActions";
import Achievements from "../../components/dashboard/Achievements";

function Dashboard() {
  const stats = {
    totalInterviews: 12,
    averageScore: 84,
    bestScore: 96,
  };

  const recentInterviews = [
    {
      id: 1,
      role: "React Developer",
      score: 92,
      date: "Jul 26, 2026",
    },
    {
      id: 2,
      role: "Frontend Developer",
      score: 85,
      date: "Jul 24, 2026",
    },
    {
      id: 3,
      role: "Node.js Developer",
      score: 78,
      date: "Jul 20, 2026",
    },
  ];

  return (
     <div className="space-y-8">
      <WelcomeBanner />

      <StatsGrid />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyProgress />
        </div>

        <AIInsights />
      </div>
        <div className="grid gap-8 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <QuickActions />
    </div>

    <Achievements />
  </div>

      <RecentInterviews interviews={recentInterviews} />
    </div>
  );
}

export default Dashboard;