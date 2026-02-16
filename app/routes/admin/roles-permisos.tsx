import { useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import { roles } from "~/data/admin";
import { gymApi } from "~/services/gymApi";
import type { Role } from "~/types/admin/role";

export default function RolesPermisos() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleList, setRoleList] = useState<Role[]>(roles);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const formKey = editingRole?.id ?? "new";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    const newRole: Role = {
      id: editingRole?.id ?? `ROL-${Date.now()}`,
      name: payload.name ?? "",
      permissions: (payload.permissions ?? "")
        .split(",")
        .map((permission) => permission.trim())
        .filter(Boolean),
    };

    const response = await gymApi.createRole(newRole);
    setMessage(response.message ?? "Rol creado.");
    setRoleList((prev) =>
      editingRole
        ? prev.map((role) => (role.id === editingRole.id ? newRole : role))
        : [newRole, ...prev]
    );
    setEditingRole(null);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Roles y permisos"
        description="Define perfiles básicos para el equipo administrativo."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Nombre del rol"
              name="name"
              placeholder="Administrador"
              required
              defaultValue={editingRole?.name}
            />
            <TextAreaField
              label="Permisos (separados por coma)"
              name="permissions"
              placeholder="Usuarios, Inventario, Membresías"
              className="md:col-span-2"
              defaultValue={editingRole?.permissions.join(", ")}
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Guardando..."
                : editingRole
                ? "Actualizar rol"
                : "Crear rol"}
            </button>
            {editingRole ? (
              <button
                type="button"
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setEditingRole(null)}
              >
                Cancelar edición
              </button>
            ) : null}
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Roles configurados
          </h3>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {roleList.map((role) => (
              <div
                key={role.id}
                className="rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {role.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {role.permissions.join(" · ")}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingRole(role)}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
