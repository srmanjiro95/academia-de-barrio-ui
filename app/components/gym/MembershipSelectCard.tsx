import type { Membership } from "~/types/catalog/membership";

interface MembershipSelectCardProps {
  membership: Membership;
  isSelected: boolean;
  onSelect: () => void;
}

export function MembershipSelectCard({
  membership,
  isSelected,
  onSelect,
}: MembershipSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-full flex-col gap-3 rounded-2xl border p-4 text-left transition ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
      }`}
    >
      <div className="h-32 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <img
          src={membership.imageUrl}
          alt={membership.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold">{membership.name}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {membership.duration} · ${membership.price.toLocaleString("es-MX")}
        </p>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {membership.includes.map((item) => (
            <p key={item}>• {item}</p>
          ))}
        </div>
      </div>
    </button>
  );
}
