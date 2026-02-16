import type { GymMember } from "~/types/gym/member";
import { MemberSelectCard } from "~/components/gym/MemberSelectCard";

interface MemberSelectModalProps {
  isOpen: boolean;
  members: GymMember[];
  selectedMemberId?: string | null;
  onSelect: (member: GymMember) => void;
  onClose: () => void;
}

export function MemberSelectModal({
  isOpen,
  members,
  selectedMemberId,
  onSelect,
  onClose,
}: MemberSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar selección de miembro"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Seleccionar miembro existente
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Elige un miembro para asignar la membresía.
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
          {members.map((member) => (
            <MemberSelectCard
              key={member.id}
              member={member}
              isSelected={member.id === selectedMemberId}
              onSelect={() => onSelect(member)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
