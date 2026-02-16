import { useId, useState } from "react";

interface FileFieldProps {
  label: string;
  name: string;
  accept?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
}

export function FileField({
  label,
  name,
  accept,
  required,
  className = "",
  helperText = "PNG, JPG o WebP (máx. 4MB).",
}: FileFieldProps) {
  const inputId = useId();
  const [fileName, setFileName] = useState("Sin archivo seleccionado");

  return (
    <div className={`space-y-2 text-sm text-zinc-700 dark:text-zinc-200 ${className}`}>
      <label htmlFor={inputId} className="font-medium">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/40">
        <input
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          required={required}
          onChange={(event) =>
            setFileName(event.target.files?.[0]?.name ?? "Sin archivo seleccionado")
          }
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className="cursor-pointer rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Subir archivo
        </label>
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {fileName}
          </p>
          <p className="text-xs text-zinc-400">{helperText}</p>
        </div>
      </div>
    </div>
  );
}