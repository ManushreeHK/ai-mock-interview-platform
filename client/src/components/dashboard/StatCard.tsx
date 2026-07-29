import { TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
}: Props) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <TrendingUp
              size={14}
              className="text-emerald-500"
            />

            <span className="text-sm font-medium text-emerald-600">
              {subtitle}
            </span>
          </div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <Icon
            size={26}
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
}