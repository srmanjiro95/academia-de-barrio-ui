import { useMemo, useState } from "react";
import { Card } from "~/components/common/Card";
import { FileField } from "~/components/forms/FileField";
import { api } from "~/services/api";
import { PRODUCT_CATEGORIES, type Product } from "~/types/catalog/product";
import type { Membership } from "~/types/catalog/membership";
import type {
  Promotion,
  PromotionDiscountType,
  PromotionScope,
  PromotionStatus,
  PromotionType,
} from "~/types/gym/promotion";

interface PromotionFormDrawerProps {
  products: Product[];
  memberships: Membership[];
  initialPromotion?: Promotion;
  onClose: () => void;
  onCreate: (promotion: Promotion) => void | Promise<void>;
}

const createPromoCode = () =>
  `PROMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

function deriveInitialScope(initialPromotion?: Promotion): PromotionScope {
  if (initialPromotion?.scope) return initialPromotion.scope;
  if (initialPromotion?.type === "Inscripción") return "Inscripción";
  if (initialPromotion?.type === "Membresía") return "Membresías";
  return "Toda la tienda";
}

const getDefaultCategory = (category?: string) => {
  if (!category) return PRODUCT_CATEGORIES[0];
  return PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])
    ? (category as (typeof PRODUCT_CATEGORIES)[number])
    : PRODUCT_CATEGORIES[0];
};

export function PromotionFormDrawer({
  products,
  memberships,
  initialPromotion,
  onClose,
  onCreate,
}: PromotionFormDrawerProps) {
  const [title, setTitle] = useState(initialPromotion?.title ?? "");
  const [type, setType] = useState<PromotionType>(
    initialPromotion?.type ?? "Descuento a producto"
  );
  const [discountType, setDiscountType] = useState<PromotionDiscountType>(
    initialPromotion?.discountType ?? "Porcentaje"
  );
  const [scope, setScope] = useState<PromotionScope>(deriveInitialScope(initialPromotion));
  const [category, setCategory] = useState(getDefaultCategory(initialPromotion?.category));
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialPromotion?.productIds ?? []
  );
  const [selectedMembershipIds, setSelectedMembershipIds] = useState<string[]>(
    initialPromotion?.membershipIds ?? []
  );
  const [amount, setAmount] = useState(initialPromotion?.amount ?? 1);
  const [description, setDescription] = useState(initialPromotion?.description ?? "");
  const [startDate, setStartDate] = useState(initialPromotion?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialPromotion?.endDate ?? "");
  const [status, setStatus] = useState<PromotionStatus>(
    initialPromotion?.status ?? "Activo"
  );
  const [imageUrl, setImageUrl] = useState(initialPromotion?.imageUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState(initialPromotion?.code ?? createPromoCode());

  const amountLabel = discountType === "Porcentaje" ? "Porcentaje" : "Monto fijo";
  const maxAmount = discountType === "Porcentaje" ? 100 : undefined;

  const canChooseScope = type === "Descuento a producto";
  const showCategoryInput = canChooseScope && scope === "Categoría";
  const showProductSelection = canChooseScope && scope === "Productos específicos";
  const showMembershipSelection = type === "Membresía";

  const previewPromotion = useMemo<Promotion>(
    () => ({
      id: "PREVIEW",
      title: title || "Nueva promoción",
      type,
      discountType,
      amount,
      description,
      startDate: startDate || "YYYY-MM-DD",
      endDate: endDate || "YYYY-MM-DD",
      code,
      status,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
      scope:
        type === "Inscripción"
          ? "Inscripción"
          : type === "Membresía"
          ? "Membresías"
          : scope,
      category: showCategoryInput ? category : undefined,
      productIds: showProductSelection ? selectedProductIds : [],
      membershipIds: showMembershipSelection ? selectedMembershipIds : [],
    }),
    [
      amount,
      category,
      code,
      description,
      discountType,
      endDate,
      imageUrl,
      scope,
      selectedMembershipIds,
      selectedProductIds,
      showCategoryInput,
      showMembershipSelection,
      showProductSelection,
      startDate,
      status,
      title,
      type,
    ]
  );

  const handleSubmit = async () => {
    if (!title || !description || !startDate || !endDate) return;
    if (!imageUrl && !imageFile) return;
    if (amount < 1) return;
    if (maxAmount && amount > maxAmount) return;

    if (showCategoryInput && !category.trim()) {
      setErrorMessage("Define una categoría para la promoción.");
      return;
    }

    if (showProductSelection && selectedProductIds.length === 0) {
      setErrorMessage("Selecciona al menos un producto participante.");
      return;
    }

    if (showMembershipSelection && selectedMembershipIds.length === 0) {
      setErrorMessage("Selecciona al menos una membresía participante.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    let nextImageUrl = imageUrl;

    if (imageFile) {
      const uploadResponse = await api.uploadImage(imageFile, "promotions");
      if (!uploadResponse.ok) {
        setErrorMessage(uploadResponse.message ?? "No se pudo subir la imagen.");
        setIsSubmitting(false);
        return;
      }
      nextImageUrl = uploadResponse.data.image_url;
      setImageUrl(nextImageUrl);
    }

    const promotion: Promotion = {
      ...previewPromotion,
      imageUrl: nextImageUrl,
      id: initialPromotion?.id ?? `PROMO-${Date.now()}`,
    };

    await onCreate(promotion);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar promoción"
        onClick={onClose}
      />
      <aside className="relative ml-auto h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Catálogo de promociones</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {initialPromotion ? "Editar promoción" : "Nueva promoción"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Título</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <FileField
            label="Imagen"
            name="imageFile"
            accept="image/*"
            onChange={setImageFile}
            helperText={
              imageUrl
                ? "Selecciona una nueva imagen si deseas reemplazar la actual."
                : "Sube la imagen principal de la promoción."
            }
          />

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Tipo de promoción</span>
              <select
                value={type}
                onChange={(event) => {
                  const nextType = event.target.value as PromotionType;
                  setType(nextType);
                  if (nextType === "Inscripción") {
                    setScope("Inscripción");
                  } else if (nextType === "Membresía") {
                    setScope("Membresías");
                  } else {
                    setScope("Toda la tienda");
                  }
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option>Descuento a producto</option>
                <option>Membresía</option>
                <option>Inscripción</option>
              </select>
            </div>

            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Tipo de descuento</span>
              <select
                value={discountType}
                onChange={(event) => setDiscountType(event.target.value as PromotionDiscountType)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option>Porcentaje</option>
                <option>Monto fijo</option>
              </select>
            </div>
          </div>

          {canChooseScope ? (
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Aplicar a</span>
              <select
                value={scope}
                onChange={(event) => setScope(event.target.value as PromotionScope)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option>Toda la tienda</option>
                <option>Categoría</option>
                <option>Productos específicos</option>
              </select>
            </div>
          ) : null}

          {showCategoryInput ? (
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Categoría objetivo</span>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as (typeof PRODUCT_CATEGORIES)[number])
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {PRODUCT_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {showProductSelection ? (
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Productos participantes</span>
              <select
                multiple
                value={selectedProductIds}
                onChange={(event) => {
                  const values = Array.from(event.target.selectedOptions).map((option) => option.value);
                  setSelectedProductIds(values);
                }}
                className="h-32 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {showMembershipSelection ? (
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Membresías participantes</span>
              <select
                multiple
                value={selectedMembershipIds}
                onChange={(event) =>
                  setSelectedMembershipIds(
                    Array.from(event.target.selectedOptions).map((option) => option.value)
                  )
                }
                className="h-32 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {memberships.map((membership) => (
                  <option key={membership.id} value={membership.id}>
                    {membership.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">{amountLabel}</span>
            <input
              type="number"
              min={1}
              max={maxAmount}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Descripción</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Fecha inicio</span>
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Fecha fin</span>
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
            </div>
          </div>

          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Código promocional</span>
            <div className="flex items-center gap-2">
              <input value={code} readOnly className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
              <button type="button" onClick={() => setCode(createPromoCode())} className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Generar</button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Estatus</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as PromotionStatus)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Vista previa rápida</p>
          <Card>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{previewPromotion.title}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{previewPromotion.description}</p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{previewPromotion.startDate} → {previewPromotion.endDate}</p>
          </Card>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancelar</button>
          <button type="button" onClick={() => { void handleSubmit(); }} disabled={isSubmitting} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
            {isSubmitting ? "Guardando..." : initialPromotion ? "Actualizar promoción" : "Guardar promoción"}
          </button>
        </div>
      </aside>
    </div>
  );
}
