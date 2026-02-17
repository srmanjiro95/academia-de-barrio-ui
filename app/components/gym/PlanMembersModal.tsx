import type { GymMember } from "~/types/gym/member";

interface PlanMembersModalProps {
  isOpen: boolean;
  availableMembers: GymMember[];
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function PlanMembersModal({
  isOpen,
  availableMembers,
  selectedMemberIds,
  onToggleMember,
  onClose,
  onConfirm,
}: PlanMembersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar selección de miembros"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Agregar miembros al plan
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Selecciona los miembros que quieras vincular.
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

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {availableMembers.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Todos los miembros ya están en este plan.
            </p>
          ) : (
            availableMembers.map((member) => {
              const isSelected = selectedMemberIds.includes(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => onToggleMember(member.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {member.membership?.name ?? "Sin membresía"} · {member.status}
                  </p>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={selectedMemberIds.length === 0}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Agregar seleccionados
          </button>
        </div>
      </div>
    </div>
  );
}
