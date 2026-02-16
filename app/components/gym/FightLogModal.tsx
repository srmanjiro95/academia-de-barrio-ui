import { FileField } from "~/components/forms/FileField";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import type { FightCategory, FightLog, FightLogInput } from "~/components/gym/MemberDrawer";

interface FightLogModalProps {
  isOpen: boolean;
  categories: FightCategory[];
  initialCategory?: FightCategory;
  initialResult?: FightLog["result"];
  initialMethod?: FightLog["method"];
  onClose: () => void;
  onSubmit: (log: FightLogInput) => void;
}

export function FightLogModal({
  isOpen,
  categories,
  initialCategory,
  initialResult,
  initialMethod,
  onClose,
  onSubmit,
}: FightLogModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const category = formData.get("logCategory") as FightCategory;
    const result = formData.get("logResult") as FightLog["result"];
    const method = formData.get("logMethod") as FightLog["method"];
    const notes = String(formData.get("logNotes") ?? "");
    const opponent = String(formData.get("logOpponent") ?? "");
    const location = String(formData.get("logLocation") ?? "");
    const date = String(formData.get("logDate") ?? new Date().toISOString());
    const evidence = formData.getAll("logEvidence");

    onSubmit({
      category,
      result,
      method,
      opponent,
      location,
      notes,
      date,
      evidenceCount: evidence.length,
      hasEvidence: evidence.length > 0,
    });

    event.currentTarget.reset();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar bitácora"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Registrar pelea
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Añade notas y evidencia para la bitácora.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Categoría</span>
              <select
                name="logCategory"
                defaultValue={initialCategory ?? categories[0]}
                disabled
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:disabled:bg-zinc-900/60 dark:disabled:text-zinc-400"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Resultado</span>
              <select
                name="logResult"
                defaultValue={initialResult ?? "Victoria"}
                disabled
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:disabled:bg-zinc-900/60 dark:disabled:text-zinc-400"
              >
                <option>Victoria</option>
                <option>Derrota</option>
                <option>Empate</option>
              </select>
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Método</span>
              <select
                name="logMethod"
                defaultValue={initialMethod ?? "KO"}
                disabled
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:disabled:bg-zinc-900/60 dark:disabled:text-zinc-400"
              >
                <option>KO</option>
                <option>Puntos</option>
                <option>N/A</option>
              </select>
            </div>
            <TextField
              label="Fecha"
              name="logDate"
              defaultValue={new Date().toISOString().slice(0, 10)}
              type="date"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Contrincante"
              name="logOpponent"
              placeholder="Nombre del rival"
            />
            <TextField
              label="Arena / Ubicación"
              name="logLocation"
              placeholder="Gimnasio, ciudad"
            />
          </div>
          <TextAreaField
            label="Notas de la pelea"
            name="logNotes"
            placeholder="Observaciones relevantes, rival, estrategia, etc."
            rows={3}
            className="md:col-span-2"
          />
          <FileField
            label="Evidencia (fotos o clips)"
            name="logEvidence"
            accept="image/*,video/*"
            helperText="Puedes subir múltiples archivos (fotos o videos cortos)."
            multiple
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
