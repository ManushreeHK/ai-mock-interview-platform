import { Mic, Trophy, Star, Flame } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Interviews"
        value="12"
        subtitle="+3 this week"
        icon={Mic}
        iconBg="bg-blue-600"
      />

      <StatCard
        title="Average Score"
        value="84%"
        subtitle="+8% this week"
        icon={Star}
        iconBg="bg-amber-500"
      />

      <StatCard
        title="Best Score"
        value="96%"
        subtitle="Personal Best"
        icon={Trophy}
        iconBg="bg-emerald-600"
      />

      <StatCard
        title="Current Streak"
        value="6 Days"
        subtitle="Keep it up!"
        icon={Flame}
        iconBg="bg-rose-500"
      />
    </div>
  );
}