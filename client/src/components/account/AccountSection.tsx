import type { ReactNode } from "react";

export default function AccountSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}
