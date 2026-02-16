import { useState } from "react";
import { Card } from "~/components/common/Card";
import { ConfirmationModal } from "~/components/common/ConfirmationModal";
import { PageHeader } from "~/components/common/PageHeader";
import { PromotionCard } from "~/components/gym/PromotionCard";
import { PromotionFormDrawer } from "~/components/gym/PromotionFormDrawer";
import { promotions as seedPromotions } from "~/data/promotions";
import type { Promotion } from "~/types/gym/promotion";

export default function PromocionesCatalogo() {
  const [promotions, setPromotions] = useState<Promotion[]>(seedPromotions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Catálogo de promociones"
        description="Crea y administra promociones para inscripción y descuentos."
        actions={
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Crear promoción
          </button>
        }
      />

      <Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onEdit={() => {
                setIsFormOpen(false);
                setEditingPromotion(promotion);
              }}
              onDelete={() => setDeleteTarget(promotion)}
            />
          ))}
        </div>
      </Card>

      {isFormOpen ? (
        <PromotionFormDrawer
          onClose={() => setIsFormOpen(false)}
          onCreate={(promotion) => {
            setPromotions((prev) => [promotion, ...prev]);
            setIsFormOpen(false);
          }}
        />
      ) : null}

      {editingPromotion ? (
        <PromotionFormDrawer
          initialPromotion={editingPromotion}
          onClose={() => setEditingPromotion(null)}
          onCreate={(promotion) => {
            setPromotions((prev) =>
              prev.map((item) => (item.id === promotion.id ? promotion : item))
            );
            setEditingPromotion(null);
          }}
        />
      ) : null}

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Eliminar promoción"
        description={`¿Deseas eliminar la promoción "${deleteTarget?.title ?? ""}"?`}
        confirmLabel="Eliminar"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setPromotions((prev) =>
            prev.filter((promotion) => promotion.id !== deleteTarget.id)
          );
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
