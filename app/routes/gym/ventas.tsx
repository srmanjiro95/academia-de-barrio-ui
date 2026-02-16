import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { SelectField } from "~/components/forms/SelectField";
import { TextField } from "~/components/forms/TextField";
import { products } from "~/data/catalog";
import { sales } from "~/data/gym";
import { gymApi } from "~/services/gymApi";
import type { Sale } from "~/types/gym/sale";

export default function VentasGym() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>(
    {}
  );

  const selectedProducts = products.filter(
    (product) => (productQuantities[product.id] ?? 0) > 0
  );

  const total = useMemo(
    () =>
      selectedProducts.reduce(
        (sum, product) => sum + product.price * (productQuantities[product.id] ?? 0),
        0
      ),
    [productQuantities, selectedProducts]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;
    const firstProduct = selectedProducts[0];

    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      customer: payload.customer ?? "",
      product: firstProduct?.name ?? "Sin producto",
      quantity: selectedProducts.reduce(
        (sum, product) => sum + (productQuantities[product.id] ?? 0),
        0
      ),
      total,
      date: new Date().toISOString(),
    };

    const response = await gymApi.registerSale(newSale);
    setMessage(response.message ?? "Venta registrada.");
    setIsSubmitting(false);
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Proceso de ventas"
        description="Registro de ventas por cliente registrado y no registrado."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Cliente"
                name="customer"
                placeholder="Nombre o 'Cliente externo'"
                required
              />
              <SelectField
                label="Tipo de cliente"
                name="customerType"
                options={[
                  { label: "Registrado", value: "registrado" },
                  { label: "No registrado", value: "no-registrado" },
                ]}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Selecciona productos
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (productQuantities[product.id] ?? 0) > 0 ? 0 : 1
                      )
                    }
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      (productQuantities[product.id] ?? 0) > 0
                        ? "border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
                    }`}
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {product.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        ${product.price} · {product.units} disponibles
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProducts.length > 0 ? (
              <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Cantidades seleccionadas
                </p>
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-200">
                        {product.name}
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={productQuantities[product.id] ?? 1}
                        onChange={(event) =>
                          handleQuantityChange(
                            product.id,
                            Math.max(1, Number(event.target.value))
                          )
                        }
                        className="w-20 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                      />
                      <span className="text-sm font-semibold text-emerald-600">
                        ${(product.price * (productQuantities[product.id] ?? 0)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Monto total</span>
                <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-600 dark:border-zinc-700 dark:bg-zinc-950">
                  ${total.toFixed(2)}
                </div>
              </div>
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Fecha</span>
                <div className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                  {new Date().toLocaleString("es-MX")}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Registrar venta"}
            </button>
            {message ? (
              <p className="text-sm text-emerald-600">{message}</p>
            ) : null}
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Últimas ventas
          </h3>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {sale.customer}
                  </p>
                  <span className="text-sm font-semibold text-emerald-600">
                    ${sale.total}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {sale.product} · {sale.quantity} pza · {sale.date}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
