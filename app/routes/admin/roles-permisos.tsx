import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { LoadingOverlay } from "~/components/common/LoadingOverlay";
import { TextField } from "~/components/forms/TextField";
import { api } from "~/services/api";
import type { Permissions, Role } from "~/types/admin/role";

export default function RolesPermisos() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [permissionCatalog, setPermissionCatalog] = useState<Permissions[]>([]);
  const [newPermissionName, setNewPermissionName] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        api.listRoles(),
        api.listPermissions(),
      ]);
      if (!isMounted) return;

      if (rolesResponse.ok) {
        setRoleList(rolesResponse.data);
      } else {
        setMessage(rolesResponse.message ?? "No se pudieron cargar los roles.");
      }

      if (permissionsResponse.ok) {
        setPermissionCatalog(permissionsResponse.data);
      }

      setIsLoading(false);
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedPermissionIds(editingRole?.permissions.map((permission) => permission.id) ?? []);
  }, [editingRole]);

  const catalogPermissions = useMemo(() => {
    if (permissionCatalog.length > 0) {
      return permissionCatalog;
    }

    return roleList
      .flatMap((role) => role.permissions)
      .filter(
        (permission, index, array) =>
          array.findIndex((item) => item.id === permission.id) === index
      );
  }, [permissionCatalog, roleList]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const response = await api.listRoles();
      if (!isMounted) return;
      if (response.ok) {
        setRoleList(response.data);
      } else {
        setMessage(response.message ?? "No se pudieron cargar los roles.");
      }
      setIsLoading(false);
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);


  const formKey = editingRole?.id ?? "new";

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleAddPermission = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = newPermissionName.trim();
    if (!cleanName) return;

    const exists = catalogPermissions.some(
      (permission) => permission.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {
      setMessage("Ese permiso ya existe en el catálogo.");
      return;
    }

    const response = await api.createPermission({ id: "", name: cleanName });
    if (!response.ok) {
      setMessage(response.message ?? "No se pudo crear el permiso.");
      return;
    }

    setPermissionCatalog((prev) => [response.data, ...prev]);
    setSelectedPermissionIds((prev) => [...prev, response.data.id]);
    setNewPermissionName("");
    setMessage(response.message ?? `Permiso "${cleanName}" agregado al catálogo.`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    const selectedPermissions = catalogPermissions.filter((permission) =>
      selectedPermissionIds.includes(permission.id)
    );

    const newRole: Role = {
      id: editingRole?.id ?? `ROL-${Date.now()}`,
      name: payload.name ?? "",
      permissions: selectedPermissions,
    };

    const isEditing = Boolean(editingRole);
    const response = isEditing
      ? await api.updateRole(newRole)
      : await api.createRole(newRole);

    if (!response.ok) {
      setMessage(response.message ?? "No se pudo crear el rol.");
      setIsSubmitting(false);
      return;
    }

    setMessage(response.message ?? (isEditing ? "Rol actualizado." : "Rol creado."));
    setRoleList((prev) =>
      isEditing
        ? prev.map((role) => (role.id === editingRole?.id ? response.data : role))
        : [response.data, ...prev]
    );
    setEditingRole(null);
    setSelectedPermissionIds([]);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <LoadingOverlay isOpen={isLoading} />
      <PageHeader
        title="Roles y permisos"
        description="Define perfiles básicos y administra el catálogo de permisos en una sola pantalla."
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

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Permisos del rol
              </p>
              <div className="grid gap-2 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700 md:grid-cols-2">
                {catalogPermissions.length === 0 ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    No hay permisos en catálogo todavía.
                  </p>
                ) : (
                  catalogPermissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissionIds.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="h-4 w-4 rounded border-zinc-300"
                      />
                      {permission.name}
                    </label>
                  ))
                )}
              </div>
            </div>

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
                onClick={() => {
                  setEditingRole(null);
                  setSelectedPermissionIds([]);
                }}
              >
                Cancelar edición
              </button>
            ) : null}

            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          </form>

          <form
            onSubmit={handleAddPermission}
            className="mt-6 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700"
          >
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Crear permiso
            </p>
            <TextField
              label="Nombre del permiso"
              name="permissionName"
              placeholder="Reportes financieros"
              value={newPermissionName}
              onChange={(event) => setNewPermissionName(event.target.value)}
              required
            />
            <button
              type="submit"
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Agregar permiso al catálogo
            </button>
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
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{role.name}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {role.permissions.map((permission) => permission.name).join(" · ")}
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
