import { useMemo, useState } from "react";
import { Card } from "~/components/common/Card";
import { PlanMembersModal } from "~/components/gym/PlanMembersModal";
import type { GymMember } from "~/types/gym/member";
import type { DevelopmentPlan } from "~/types/gym/plan";

interface AddPlanDrawerProps {
  members: GymMember[];
  onClose: () => void;
  onCreatePlan: (plan: DevelopmentPlan, memberIds: string[]) => void;
  initialPlan?: DevelopmentPlan | null;
  initialMemberIds?: string[];
}

export function AddPlanDrawer({
  members,
  onClose,
  onCreatePlan,
  initialPlan,
  initialMemberIds,
}: AddPlanDrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    initialMemberIds ?? []
  );
  const [name, setName] = useState(initialPlan?.name ?? "");
  const [focus, setFocus] = useState(initialPlan?.focus ?? "");
  const [description, setDescription] = useState(initialPlan?.description ?? "");
  const [coach, setCoach] = useState(initialPlan?.coach ?? "");
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number | "">(
    initialPlan?.sessionsPerWeek ?? ""
  );

  const selectedMembers = useMemo(
    () => members.filter((member) => selectedMemberIds.includes(member.id)),
    [members, selectedMemberIds]
  );

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreatePlan = () => {
    if (!name || !focus || !description || !coach || !sessionsPerWeek) return;
    const primaryMember = members.find((member) => member.id === selectedMemberIds[0]);

    const newPlan: DevelopmentPlan = {
      id: initialPlan?.id ?? `PLAN-${Date.now()}`,
      memberId: selectedMemberIds[0],
      memberName: primaryMember
        ? `${primaryMember.firstName} ${primaryMember.lastName}`
        : "Sin asignar",
      name,
      focus,
      description,
      coach,
      sessionsPerWeek: Number(sessionsPerWeek),
    };
    onCreatePlan(newPlan, selectedMemberIds);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          aria-label="Cerrar alta de plan"
          onClick={onClose}
        />
        <aside className="relative ml-auto h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl dark:bg-zinc-950">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Nuevo plan de desarrollo
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {initialPlan ? "Editar plan" : "Agregar plan"}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Completa la información del plan y asigna miembros.
              </p>
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
              <span className="font-medium">Nombre del plan</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                placeholder="Plan Fortaleza"
                required
              />
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Focus</span>
              <input
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                placeholder="Resistencia y defensa"
                required
              />
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Descripción</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                placeholder="Rutina enfocada en cardio, técnica y guardia."
                required
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Coach responsable</span>
                <input
                  value={coach}
                  onChange={(event) => setCoach(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  placeholder="Coach Mariana"
                  required
                />
              </div>
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Sesiones por semana</span>
                <input
                  value={sessionsPerWeek}
                  onChange={(event) =>
                    setSessionsPerWeek(
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value)
                    )
                  }
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  placeholder="4"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Miembros agregados
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Seleccionar miembros
              </button>
            </div>

            {selectedMembers.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Aún no hay miembros agregados.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedMembers.map((member) => (
                  <Card key={member.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {member.membership?.name ?? "Sin membresía"} · {member.status}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreatePlan}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {initialPlan ? "Actualizar plan" : "Guardar plan"}
            </button>
          </div>
        </aside>
      </div>

      <PlanMembersModal
        isOpen={isModalOpen}
        availableMembers={members}
        selectedMemberIds={selectedMemberIds}
        onToggleMember={toggleMemberSelection}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      />
    </>
  );
}
