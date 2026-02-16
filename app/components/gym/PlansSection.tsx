import { Card } from "~/components/common/Card";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import type { DevelopmentPlan } from "~/types/gym/plan";

interface PlansSectionProps {
  memberId: string;
  memberName: string;
  assignedPlan?: DevelopmentPlan | null;
  plansCatalog: DevelopmentPlan[];
  onAssignPlan: (memberId: string, planId: string) => void;
  onCreateCustomPlan: (
    memberId: string,
    plan: DevelopmentPlan,
    addToCatalog: boolean
  ) => void;
}

export function PlansSection({
  memberId,
  memberName,
  assignedPlan,
  plansCatalog,
  onAssignPlan,
  onCreateCustomPlan,
}: PlansSectionProps) {
  const handlePlanSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const plan: DevelopmentPlan = {
      id: `PLAN-${Date.now()}`,
      memberName,
      focus: String(formData.get("customFocus") ?? ""),
      coach: String(formData.get("customCoach") ?? ""),
      sessionsPerWeek: Number(formData.get("customSessions") ?? 0),
    };
    const addToCatalog = formData.get("addToCatalog") === "on";
    onCreateCustomPlan(memberId, plan, addToCatalog);
    event.currentTarget.reset();
  };

  return (
    <div className="mt-10 space-y-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Planes de desarrollo
      </h3>
      <Card className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Plan actual
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {assignedPlan?.focus ?? "Sin plan asignado"}
            </p>
            {assignedPlan ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Coach: {assignedPlan.coach} · {assignedPlan.sessionsPerWeek} sesiones
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
          <span className="font-medium">Selecciona un plan base</span>
          <select
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            onChange={(event) => onAssignPlan(memberId, event.target.value)}
            defaultValue={assignedPlan?.id ?? ""}
          >
            <option value="">Sin asignar</option>
            {plansCatalog.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.focus}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        <form onSubmit={handlePlanSubmit} className="space-y-4">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Crear plan personalizado
          </p>
          <TextAreaField
            label="Rutina / foco"
            name="customFocus"
            placeholder="Trabajo técnico, cardio, defensa..."
            rows={3}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="Coach" name="customCoach" />
            <TextField label="Sesiones por semana" name="customSessions" type="number" />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <input type="checkbox" name="addToCatalog" className="rounded" />
            Guardar en catálogo de planes
          </label>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Guardar plan
          </button>
        </form>
      </Card>
    </div>
  );
}
