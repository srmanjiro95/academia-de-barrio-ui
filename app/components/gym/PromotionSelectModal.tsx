import { PromotionCard } from "~/components/gym/PromotionCard";
import type { Promotion } from "~/types/gym/promotion";

interface PromotionSelectModalProps {
  isOpen: boolean;
  promotions: Promotion[];
  selectedPromotionId?: string | null;
  onSelect: (promotion: Promotion) => void;
  onClose: () => void;
}

export function PromotionSelectModal({
  isOpen,
  promotions,
  selectedPromotionId,
  onSelect,
  onClose,
}: PromotionSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar selección de promoción"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Seleccionar promoción
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Elige la promoción que deseas aplicar.
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
          {promotions
            .filter((promotion) => promotion.status === "Activo")
            .map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                isSelected={promotion.id === selectedPromotionId}
                onSelect={() => onSelect(promotion)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
