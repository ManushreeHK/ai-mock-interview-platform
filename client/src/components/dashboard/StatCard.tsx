import { Minus } from "lucide-react";
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
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Minus size={14} className="text-slate-400" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon
            size={22}
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}
