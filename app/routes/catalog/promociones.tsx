import { useEffect, useState } from "react";
import { Card } from "~/components/common/Card";
import { ConfirmationModal } from "~/components/common/ConfirmationModal";
import { PageHeader } from "~/components/common/PageHeader";
import { LoadingOverlay } from "~/components/common/LoadingOverlay";
import { PromotionCard } from "~/components/gym/PromotionCard";
import { PromotionFormDrawer } from "~/components/gym/PromotionFormDrawer";
import { api } from "~/services/api";
import type { Membership } from "~/types/catalog/membership";
import type { Product } from "~/types/catalog/product";
import type { Promotion } from "~/types/gym/promotion";

export default function PromocionesCatalogo() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const [promotionsResponse, productsResponse, membershipsResponse] =
        await Promise.all([api.listPromotions(), api.listProducts(), api.listMemberships()]);
      if (!isMounted) return;
      if (promotionsResponse.ok) {
        setPromotions(promotionsResponse.data);
      } else {
        setMessage(promotionsResponse.message ?? "No se pudieron cargar las promociones.");
      }

      if (productsResponse.ok) {
        setProducts(productsResponse.data);
      }

      if (membershipsResponse.ok) {
        setMemberships(membershipsResponse.data);
      }

      setIsLoading(false);
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpsertPromotion = async (promotion: Promotion) => {
    const response = editingPromotion
      ? await api.updatePromotion(promotion)
      : await api.createPromotion(promotion);
    if (!response.ok) {
      setMessage(response.message ?? "No se pudo guardar la promoción.");
      return;
    }

    setMessage(response.message ?? "Promoción guardada.");
    const savedPromotion = response.data;

    if (editingPromotion) {
      setPromotions((prev) =>
        prev.map((item) => (item.id === editingPromotion.id ? savedPromotion : item))
      );
      setEditingPromotion(null);
      return;
    }

    setPromotions((prev) => [savedPromotion, ...prev]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <LoadingOverlay isOpen={isLoading} />
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

      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

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
          products={products}
          memberships={memberships}
          onClose={() => setIsFormOpen(false)}
          onCreate={(promotion) => {
            void handleUpsertPromotion(promotion);
          }}
        />
      ) : null}

      {editingPromotion ? (
        <PromotionFormDrawer
          products={products}
          memberships={memberships}
          initialPromotion={editingPromotion}
          onClose={() => setEditingPromotion(null)}
          onCreate={(promotion) => {
            void handleUpsertPromotion(promotion);
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
