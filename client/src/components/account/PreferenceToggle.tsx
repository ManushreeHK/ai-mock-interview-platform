export default function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <span>
        <span className="block font-semibold text-slate-900 dark:text-slate-100">
          {label}
        </span>
        <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}
