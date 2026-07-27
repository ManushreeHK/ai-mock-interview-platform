import {
  Mic,
  Trophy,
  TrendingUp,
  Flame,
} from "lucide-react";
import StatCard from "./StatsCard";


export default function StatsGrid() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Interviews"
        value="12"
        subtitle="+3 this week"
        icon={Mic}
        iconColor="bg-blue-100 text-blue-600"
      />

      <StatCard
        title="Average Score"
        value="84%"
        subtitle="+8% improvement"
        icon={TrendingUp}
        iconColor="bg-emerald-100 text-emerald-600"
      />

      <StatCard
        title="Best Score"
        value="96%"
        subtitle="Personal Best"
        icon={Trophy}
        iconColor="bg-amber-100 text-amber-600"
      />

      <StatCard
        title="Current Streak"
        value="6 Days"
        subtitle="Keep it going!"
        icon={Flame}
        iconColor="bg-orange-100 text-orange-600"
      />
    </section>
  );
}