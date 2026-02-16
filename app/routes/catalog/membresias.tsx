import { useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { RealtimeStatus } from "~/components/common/RealtimeStatus";
import { FileField } from "~/components/forms/FileField";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import { memberships } from "~/data/catalog";
import { gymApi } from "~/services/gymApi";
import type { Membership } from "~/types/catalog/membership";

export default function MembresiasCatalogo() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [membershipList, setMembershipList] = useState<Membership[]>(memberships);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(
    null
  );

  const formKey = editingMembership?.id ?? "new";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    const newMembership: Membership = {
      id: editingMembership?.id ?? `MEM-${Date.now()}`,
      name: payload.name ?? "",
      price: Number(payload.price ?? 0),
      duration: payload.duration ?? "",
      includes: (payload.includes ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = await gymApi.createMembership(newMembership);
    setMessage(response.message ?? "Membresía creada.");
    setMembershipList((prev) =>
      editingMembership
        ? prev.map((item) =>
            item.id === editingMembership.id ? newMembership : item
          )
        : [newMembership, ...prev]
    );
    setEditingMembership(null);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Catálogo de membresías"
        description="Módulo en tiempo real para actualizar las membresías disponibles."
        actions={<RealtimeStatus />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
            <FileField
              label="Imagen de la membresía"
              name="imageUrl"
              accept="image/*"
              helperText="Sube el arte principal de la membresía."
            />
            <TextField
              label="Nombre de la membresía"
              name="name"
              placeholder="Box Fit Mensual"
              required
              defaultValue={editingMembership?.name}
            />
            <TextField
              label="Precio"
              name="price"
              type="number"
              placeholder="950"
              required
              defaultValue={editingMembership?.price}
            />
            <TextField
              label="Temporalidad"
              name="duration"
              placeholder="30 días"
              required
              defaultValue={editingMembership?.duration}
            />
            <TextAreaField
              label="Qué incluye (uno por línea)"
              name="includes"
              placeholder="Acceso libre\nSparring\nEvaluación"
              className="md:col-span-2"
              defaultValue={editingMembership?.includes.join("\n")}
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Guardando..."
                : editingMembership
                ? "Actualizar"
                : "Agregar"}
            </button>
            {editingMembership ? (
              <button
                type="button"
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setEditingMembership(null)}
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
            Membresías activas
          </h3>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {membershipList.map((membership) => (
              <div
                key={membership.id}
                className="flex gap-4 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {membership.imageUrl ? (
                    <img
                      src={membership.imageUrl}
                      alt={membership.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {membership.name}
                    </p>
                    <span className="text-sm font-semibold text-emerald-600">
                      ${membership.price}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {membership.duration}
                  </p>
                  <ul className="mt-2 list-disc pl-5 text-xs text-zinc-500 dark:text-zinc-400">
                    {membership.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingMembership(membership)}
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
