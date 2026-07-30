import RecentInterviews from "../../components/dashboard/RecentInterviews";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsGrid from "../../components/dashboard/StatsGrid";
import WeeklyProgress from "../../components/dashboard/WeeklyProgress";
import AIInsights from "../../components/dashboard/AIInsights";
import QuickActions from "../../components/dashboard/QuickActions";
import Achievements from "../../components/dashboard/Achievements";

function Dashboard() {
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

      <RecentInterviews />
    </div>
  );
}

export default Dashboard;
