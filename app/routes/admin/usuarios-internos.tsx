import { useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { FileField } from "~/components/forms/FileField";
import { EmergencyContactsSection } from "~/components/forms/EmergencyContactsSection";
import { FormSection } from "~/components/forms/FormSection";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import { internalUsers } from "~/data/admin";
import { gymApi } from "~/services/gymApi";
import type { InternalUser } from "~/types/admin/internal-user";

export default function UsuariosInternos() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<InternalUser[]>(internalUsers);
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null);

  const formKey = editingUser?.id ?? "new";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    const newUser: InternalUser = {
      id: editingUser?.id ?? `IU-${Date.now()}`,
      firstName: payload.firstName ?? "",
      lastName: payload.lastName ?? "",
      middleName: payload.middleName ?? "",
      email: payload.email ?? "",
      phone: payload.phone ?? "",
      address: payload.address ?? "",
      role: payload.role ?? "",
      emergencyContacts: [
        {
          name: payload.contactOneName ?? "",
          phone: payload.contactOnePhone ?? "",
          relationship: payload.contactOneRelationship ?? "",
        },
        {
          name: payload.contactTwoName ?? "",
          phone: payload.contactTwoPhone ?? "",
          relationship: payload.contactTwoRelationship ?? "",
        },
      ],
    };

    const response = await gymApi.createInternalUser(newUser);
    setMessage(response.message ?? "Usuario registrado.");
    setUsers((prev) =>
      editingUser
        ? prev.map((user) => (user.id === editingUser.id ? newUser : user))
        : [newUser, ...prev]
    );
    setEditingUser(null);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Registro de usuarios internos"
        description="Gestiona el alta de personal administrativo, recepción y entrenadores."
        actions={
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
            Exportar listado
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
            <FormSection
              title="Datos personales"
              description="Información principal del usuario interno."
            >
              <FileField label="Foto" name="photo" accept="image/*" />
              <TextField
                label="Nombre"
                name="firstName"
                placeholder="Ej. Andrea"
                required
                defaultValue={editingUser?.firstName}
              />
              <TextField
                label="Apellido paterno"
                name="lastName"
                placeholder="Ej. Santos"
                required
                defaultValue={editingUser?.lastName}
              />
              <TextField
                label="Apellido materno"
                name="middleName"
                placeholder="Ej. López"
                defaultValue={editingUser?.middleName}
              />
              <TextField
                label="Celular"
                name="phone"
                placeholder="55 0000 0000"
                required
                defaultValue={editingUser?.phone}
              />
              <TextField
                label="Correo"
                name="email"
                type="email"
                placeholder="usuario@gym.mx"
                required
                defaultValue={editingUser?.email}
              />
              <TextField
                label="Rol interno"
                name="role"
                placeholder="Recepción / Entrenador"
                required
                defaultValue={editingUser?.role}
              />
            </FormSection>

            <FormSection
              title="Dirección"
              description="Ubicación actual para reportes internos."
            >
              <TextAreaField
                label="Dirección completa"
                name="address"
                placeholder="Calle, número, ciudad"
                required
                className="md:col-span-2"
                defaultValue={editingUser?.address}
              />
            </FormSection>

            <EmergencyContactsSection
              description="Registra dos referencias para emergencias."
              includeRelationship
              required
              defaultValues={
                editingUser
                  ? {
                      contactOneName: editingUser.emergencyContacts[0]?.name,
                      contactOnePhone: editingUser.emergencyContacts[0]?.phone,
                      contactOneRelationship:
                        editingUser.emergencyContacts[0]?.relationship,
                      contactTwoName: editingUser.emergencyContacts[1]?.name,
                      contactTwoPhone: editingUser.emergencyContacts[1]?.phone,
                      contactTwoRelationship:
                        editingUser.emergencyContacts[1]?.relationship,
                    }
                  : undefined
              }
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Guardando..."
                  : editingUser
                  ? "Actualizar usuario"
                  : "Guardar usuario"}
              </button>
              {editingUser ? (
                <button
                  type="button"
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar edición
                </button>
              ) : null}
              {message ? (
                <span className="text-sm text-emerald-600">{message}</span>
              ) : null}
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Usuarios activos
          </h3>
          <ul className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {user.role} · {user.email}
                </p>
                <p className="mt-1 text-xs">Emergencia: {user.emergencyContacts[0].name}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(user)}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
