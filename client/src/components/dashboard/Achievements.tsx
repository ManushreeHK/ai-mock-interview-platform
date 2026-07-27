import {
  Trophy,
  Flame,
  Star,
  Medal,
} from "lucide-react";

const badges = [
  {
    icon: Trophy,
    title: "Top Performer",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Flame,
    title: "7 Day Streak",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Star,
    title: "90% Average",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Medal,
    title: "25 Interviews",
    color: "bg-green-100 text-green-600",
  },
];

export default function Achievements() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">
        Achievements
      </h2>

      <div className="grid grid-cols-2 gap-5">
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.title}
              className="rounded-2xl bg-slate-50 p-5 text-center"
            >
              <div
                className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${badge.color}`}
              >
                <Icon size={28} />
              </div>

              <p className="font-medium">
                {badge.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}