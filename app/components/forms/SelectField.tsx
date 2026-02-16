interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectOption[];
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export function SelectField({
  label,
  name,
  options,
  required,
  className = "",
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <label className={`space-y-2 text-sm text-zinc-700 dark:text-zinc-200 ${className}`}>
      <span className="font-medium">{label}</span>
      <select
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
