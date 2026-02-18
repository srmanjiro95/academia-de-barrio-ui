import { useMemo, useState } from "react";
import { Card } from "~/components/common/Card";
import { PlanMembersModal } from "~/components/gym/PlanMembersModal";
import type { GymMember } from "~/types/gym/member";
import type { DevelopmentPlan } from "~/types/gym/plan";

interface PlanesDrawerProps {
  plan: DevelopmentPlan;
  members: GymMember[];
  assignedMemberIds: string[];
  onClose: () => void;
  onAddMembers: (memberIds: string[]) => void;
}

export function PlanesDrawer({
  plan,
  members,
  assignedMemberIds,
  onClose,
  onAddMembers,
}: PlanesDrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const assignedMembers = useMemo(
    () =>
      members.filter((member) => assignedMemberIds.includes(member.id)),
    [assignedMemberIds, members]
  );
  const availableMembers = useMemo(
    () =>
      members.filter((member) => !assignedMemberIds.includes(member.id)),
    [assignedMemberIds, members]
  );

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAddMembers = () => {
    if (selectedMemberIds.length === 0) return;
    onAddMembers(selectedMemberIds);
    setSelectedMemberIds([]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          aria-label="Cerrar detalle del plan"
          onClick={onClose}
        />
        <aside className="relative ml-auto h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl dark:bg-zinc-950">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Plan de desarrollo
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {plan.memberName}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {plan.focus} · {plan.sessionsPerWeek} sesiones/semana
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

          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Miembros vinculados
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
            >
              + Agregar miembros
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {assignedMembers.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Aún no hay miembros vinculados a este plan.
              </p>
            ) : (
              assignedMembers.map((member) => (
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
              ))
            )}
          </div>
        </aside>
      </div>

      <PlanMembersModal
        isOpen={isModalOpen}
        availableMembers={availableMembers}
        selectedMemberIds={selectedMemberIds}
        onToggleMember={toggleMemberSelection}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMemberIds([]);
        }}
        onConfirm={handleAddMembers}
      />
    </>
  );
}
