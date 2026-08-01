interface SelectProps {
  label: string;
  options: string[];
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function Select({
  label,
  options,
  value,
  error,
  onChange,
}: SelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 outline-none transition dark:bg-slate-800 dark:text-slate-100

          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
      >
        <option value="">
          Select {label.replace("*", "").trim()}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
