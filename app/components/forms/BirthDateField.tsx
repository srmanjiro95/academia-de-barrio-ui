import { useMemo } from "react";

interface BirthDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const calculateAge = (dateString: string) => {
  if (!dateString) return null;
  const birthDate = new Date(dateString);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

export function BirthDateField({
  value,
  onChange,
  label = "Fecha de nacimiento",
}: BirthDateFieldProps) {
  const age = useMemo(() => calculateAge(value), [value]);

  return (
    <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
      <span className="font-medium">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Edad calculada: {age === null ? "—" : `${age} años`}
      </p>
    </div>
  );
}
