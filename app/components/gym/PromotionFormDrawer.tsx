import { useMemo, useState } from "react";
import { Card } from "~/components/common/Card";
import type {
  Promotion,
  PromotionDiscountType,
  PromotionStatus,
  PromotionType,
} from "~/types/gym/promotion";

interface PromotionFormDrawerProps {
  initialPromotion?: Promotion;
  onClose: () => void;
  onCreate: (promotion: Promotion) => void;
}

const createPromoCode = () =>
  `PROMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export function PromotionFormDrawer({
  initialPromotion,
  onClose,
  onCreate,
}: PromotionFormDrawerProps) {
  const [title, setTitle] = useState(initialPromotion?.title ?? "");
  const [type, setType] = useState<PromotionType>(
    initialPromotion?.type ?? "Inscripción"
  );
  const [discountType, setDiscountType] =
    useState<PromotionDiscountType>(
      initialPromotion?.discountType ?? "Porcentaje"
    );
  const [amount, setAmount] = useState(initialPromotion?.amount ?? 1);
  const [description, setDescription] = useState(
    initialPromotion?.description ?? ""
  );
  const [startDate, setStartDate] = useState(initialPromotion?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialPromotion?.endDate ?? "");
  const [status, setStatus] = useState<PromotionStatus>(
    initialPromotion?.status ?? "Activo"
  );
  const [imageUrl, setImageUrl] = useState(initialPromotion?.imageUrl ?? "");
  const [code, setCode] = useState(
    initialPromotion?.code ?? createPromoCode()
  );

  const amountLabel =
    type === "Descuento"
      ? discountType === "Porcentaje"
        ? "Porcentaje"
        : "Monto fijo"
      : "Monto de inscripción";
  const maxAmount = type === "Descuento" && discountType === "Porcentaje" ? 100 : undefined;

  const previewPromotion = useMemo<Promotion>(
    () => ({
      id: "PREVIEW",
      title: title || "Nueva promoción",
      type,
      discountType: type === "Descuento" ? discountType : undefined,
      amount,
      description,
      startDate: startDate || "YYYY-MM-DD",
      endDate: endDate || "YYYY-MM-DD",
      code,
      status,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
    }),
    [amount, code, description, discountType, endDate, imageUrl, startDate, status, title, type]
  );

  const handleSubmit = () => {
    if (!title || !description || !startDate || !endDate || !imageUrl) return;
    if (amount < 1) return;
    if (maxAmount && amount > maxAmount) return;
    const promotion: Promotion = {
      ...previewPromotion,
      id: initialPromotion?.id ?? `PROMO-${Date.now()}`,
    };
    onCreate(promotion);
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
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Catálogo de promociones
            </p>
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
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Imagen (URL)</span>
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Tipo de promoción</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as PromotionType)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option>Inscripción</option>
                <option>Descuento</option>
              </select>
            </div>
            {type === "Descuento" ? (
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Tipo de descuento</span>
                <select
                  value={discountType}
                  onChange={(event) =>
                    setDiscountType(event.target.value as PromotionDiscountType)
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option>Porcentaje</option>
                  <option>Monto fijo</option>
                </select>
              </div>
            ) : null}
          </div>
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
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Fecha fin</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Código promocional</span>
            <div className="flex items-center gap-2">
              <input
                value={code}
                readOnly
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <button
                type="button"
                onClick={() => setCode(createPromoCode())}
                className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Generar
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Estatus</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as PromotionStatus)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Vista previa
          </p>
          <Card className="space-y-2">
            <p className="text-sm font-semibold">{previewPromotion.title}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {previewPromotion.type}
              {previewPromotion.discountType
                ? ` · ${previewPromotion.discountType}`
                : ""}{" "}
              · {amountLabel} {previewPromotion.amount}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {previewPromotion.startDate} → {previewPromotion.endDate}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Código: {previewPromotion.code}
            </p>
          </Card>
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
            onClick={handleSubmit}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {initialPromotion ? "Actualizar promoción" : "Guardar promoción"}
          </button>
        </div>
      </aside>
    </div>
  );
}
