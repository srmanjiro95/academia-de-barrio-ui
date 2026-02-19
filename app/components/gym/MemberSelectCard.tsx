import type { GymMember } from "~/types/gym/member";

interface MemberSelectCardProps {
  member: GymMember;
  isSelected: boolean;
  onSelect: () => void;
  onRemove?: () => void;
}

export function MemberSelectCard({
  member,
  isSelected,
  onSelect,
  onRemove,
}: MemberSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border p-4 text-left transition ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            {member.firstName} {member.lastName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {member.email}
          </p>
        </div>
        {isSelected && onRemove ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            className="rounded-full border border-rose-200 px-2 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-950/40"
          >
            Quitar
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        {member.membership?.name ?? "Sin membresía"} · {member.status}
      </p>
    </button>
  );
}
