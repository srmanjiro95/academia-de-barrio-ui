import type { Promotion } from "~/types/gym/promotion";

interface PromotionCardProps {
  promotion: Promotion;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PromotionCard({
  promotion,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: PromotionCardProps) {
  const amountLabel =
    promotion.type === "Descuento"
      ? promotion.discountType === "Porcentaje"
        ? `${promotion.amount}%`
        : `$${promotion.amount.toLocaleString("es-MX")}`
      : `$${promotion.amount.toLocaleString("es-MX")}`;

  const cardClasses = `flex h-full flex-col gap-3 rounded-2xl border p-4 text-left transition ${
    isSelected
      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200"
      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
  }`;

  const content = (
    <>
      <div className="h-28 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <img
          src={promotion.imageUrl}
          alt={promotion.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold">{promotion.title}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {promotion.type} · {amountLabel}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {promotion.startDate} → {promotion.endDate}
        </p>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Código: {promotion.code}
        </p>
        <p
          className={`text-xs font-semibold ${
            promotion.status === "Activo"
              ? "text-emerald-600 dark:text-emerald-300"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          {promotion.status}
        </p>
      </div>
      {onEdit || onDelete ? (
        <div className="flex items-center gap-2">
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Editar
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-950/40"
            >
              Eliminar
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={cardClasses}>
        {content}
      </button>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
