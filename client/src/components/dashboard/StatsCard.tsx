import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "bg-blue-100 text-blue-600",
}: StatCardProps) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          <p className="mt-2 text-sm text-emerald-600 font-medium">
            {subtitle}
          </p>
        </div>

        <div
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            iconColor
          )}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}