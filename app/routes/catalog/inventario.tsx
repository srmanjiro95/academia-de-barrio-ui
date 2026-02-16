import { useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { RealtimeStatus } from "~/components/common/RealtimeStatus";
import { FileField } from "~/components/forms/FileField";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import { products } from "~/data/catalog";
import { gymApi } from "~/services/gymApi";
import type { Product } from "~/types/catalog/product";

export default function InventarioCatalogo() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productList, setProductList] = useState<Product[]>(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const formKey = editingProduct?.id ?? "new";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    const newProduct: Product = {
      id: editingProduct?.id ?? `PROD-${Date.now()}`,
      name: payload.name ?? "",
      units: Number(payload.units ?? 0),
      price: Number(payload.price ?? 0),
      description: payload.description ?? "",
    };

    const response = await gymApi.createProduct(newProduct);
    setMessage(response.message ?? "Producto agregado.");
    setProductList((prev) =>
      editingProduct
        ? prev.map((item) => (item.id === editingProduct.id ? newProduct : item))
        : [newProduct, ...prev]
    );
    setEditingProduct(null);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Catálogo de inventario"
        description="Inventario en tiempo real para ventas y reposición."
        actions={<RealtimeStatus />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
            <FileField
              label="Foto del producto"
              name="imageUrl"
              accept="image/*"
              helperText="Sube una imagen principal del producto."
            />
            <TextField
              label="Nombre del producto"
              name="name"
              placeholder="Guantes 14 oz"
              required
              defaultValue={editingProduct?.name}
            />
            <TextField
              label="Unidades disponibles"
              name="units"
              type="number"
              placeholder="25"
              required
              defaultValue={editingProduct?.units}
            />
            <TextField
              label="Precio"
              name="price"
              type="number"
              placeholder="1200"
              required
              defaultValue={editingProduct?.price}
            />
            <TextAreaField
              label="Descripción"
              name="description"
              placeholder="Detalle del producto"
              className="md:col-span-2"
              defaultValue={editingProduct?.description}
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Guardando..."
                : editingProduct
                ? "Actualizar"
                : "Agregar"}
            </button>
            {editingProduct ? (
              <button
                type="button"
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setEditingProduct(null)}
              >
                Cancelar edición
              </button>
            ) : null}
            {message ? (
              <p className="text-sm text-emerald-600">{message}</p>
            ) : null}
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Productos en stock
          </h3>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {productList.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {product.name}
                    </p>
                    <span className="text-sm font-semibold text-emerald-600">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {product.units} unidades disponibles
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
