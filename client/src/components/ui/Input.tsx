import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  className,
  label,
  error,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        className={clsx(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
