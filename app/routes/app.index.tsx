import { Link } from "react-router";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { RealtimeStatus } from "~/components/common/RealtimeStatus";

const quickActions = [
  {
    title: "Registrar miembro",
    description: "Alta inmediata con foto y contactos.",
    to: "/gym/miembros",
  },
  {
    title: "Crear membresía",
    description: "Catálogo en tiempo real.",
    to: "/catalogo/membresias",
  },
  {
    title: "Registrar venta",
    description: "Inventario sincronizado.",
    to: "/gym/ventas",
  },
];

export default function AppIndex() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resumen operativo"
        description="Panel principal con accesos rápidos a los módulos clave del gimnasio."
        actions={<RealtimeStatus />}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {action.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {action.description}
              </p>
            </div>
            <Link
              to={action.to}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              Ir al módulo
              <span aria-hidden>→</span>
            </Link>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Checklist de operación
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <li>✔ Revisar membresías próximas a vencer.</li>
            <li>✔ Confirmar ingresos QR de la mañana.</li>
            <li>✔ Validar stock crítico en inventario.</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Pendientes del día
          </h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <p>• 3 nuevos registros internos esperando validación.</p>
            <p>• 2 ventas pendientes de captura de comprobante.</p>
            <p>• 4 planes de desarrollo por asignar.</p>
          </div>
        </Card>
      </section>
    </div>
  );
}