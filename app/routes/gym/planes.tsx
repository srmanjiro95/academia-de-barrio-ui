import { useEffect, useMemo, useState } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { AddPlanDrawer } from "~/components/gym/AddPlanDrawer";
import { PlanesDrawer } from "~/components/gym/PlanesDrawer";
import { developmentPlans, gymMembers, planMembersByPlan } from "~/data/gym";
import { api } from "~/services/api";
import type { DevelopmentPlan } from "~/types/gym/plan";

export default function PlanesGym() {
  const [selectedPlan, setSelectedPlan] = useState<DevelopmentPlan | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [plans, setPlans] = useState<DevelopmentPlan[]>(developmentPlans);
  const [editingPlan, setEditingPlan] = useState<DevelopmentPlan | null>(null);
  const [planMembers, setPlanMembers] = useState<Record<string, string[]>>(
    () => ({ ...planMembersByPlan })
  );



  useEffect(() => {
    let isMounted = true;

    const loadPlans = async () => {
      const response = await api.listPlans();
      if (!isMounted || !response.ok || response.data.length === 0) return;
      setPlans(response.data);
    };

    void loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPlanMembers = useMemo(() => {
    if (!selectedPlan) return [];
    return planMembers[selectedPlan.id] ?? [];
  }, [planMembers, selectedPlan]);

  const handleAddMembers = (planId: string, memberIds: string[]) => {
    setPlanMembers((prev) => {
      const existing = new Set(prev[planId] ?? []);
      memberIds.forEach((id) => existing.add(id));
      return { ...prev, [planId]: Array.from(existing) };
    });
  };

  const handleCreatePlan = async (plan: DevelopmentPlan, memberIds: string[]) => {
    const planPayload: DevelopmentPlan = {
      ...plan,
      memberId: memberIds[0],
      memberName: memberIds[0]
        ? gymMembers.find((member) => member.id === memberIds[0])?.firstName ?? plan.memberName
        : plan.memberName,
    };

    const response = await api.createPlan(planPayload);
    if (!response.ok) {
      setMessage(response.message ?? "No se pudo guardar el plan.");
      return;
    }

    setMessage(response.message ?? "Plan guardado.");
    setPlans((prev) =>
      editingPlan
        ? prev.map((item) => (item.id === editingPlan.id ? response.data : item))
        : [response.data, ...prev]
    );
    setPlanMembers((prev) => ({ ...prev, [response.data.id]: memberIds }));
    setIsAddPlanOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Planes de desarrollo"
        description="Consulta los planes activos y gestiona los miembros vinculados."
      />

      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Planes activos
          </h3>
          <button
            type="button"
            onClick={() => setIsAddPlanOpen(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Agregar planes de desarrollo
          </button>
        </div>
        <div className="mt-4 grid gap-4 text-sm text-zinc-600 dark:text-zinc-300 md:grid-cols-2">
          {plans.map((plan) => {
            const memberCount = planMembers[plan.id]?.length ?? 0;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className="rounded-xl border border-zinc-100 p-4 text-left transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/60"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {plan.name}
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {plan.focus}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Coach: {plan.coach} · {plan.sessionsPerWeek} sesiones/semana
                </p>
                <p className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  {memberCount} miembros vinculados
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingPlan(plan);
                      setIsAddPlanOpen(true);
                    }}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Editar
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {selectedPlan ? (
        <PlanesDrawer
          plan={selectedPlan}
          members={gymMembers}
          assignedMemberIds={selectedPlanMembers}
          onClose={() => setSelectedPlan(null)}
          onAddMembers={(memberIds) =>
            handleAddMembers(selectedPlan.id, memberIds)
          }
        />
      ) : null}

      {isAddPlanOpen ? (
        <AddPlanDrawer
          members={gymMembers}
          onClose={() => {
            setIsAddPlanOpen(false);
            setEditingPlan(null);
          }}
          onCreatePlan={handleCreatePlan}
          initialPlan={editingPlan}
          initialMemberIds={
            editingPlan ? planMembers[editingPlan.id] ?? [] : undefined
          }
        />
      ) : null}
    </div>
  );
}
