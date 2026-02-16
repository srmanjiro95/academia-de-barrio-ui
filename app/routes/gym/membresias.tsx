import { useMemo, useState } from "react";
import { AddMemberModal } from "~/components/gym/AddMemberModal";
import { CancelMembershipModal } from "~/components/gym/CancelMembershipModal";
import { MemberSelectCard } from "~/components/gym/MemberSelectCard";
import { MemberSelectModal } from "~/components/gym/MemberSelectModal";
import { MembershipSelectCard } from "~/components/gym/MembershipSelectCard";
import { PromotionCard } from "~/components/gym/PromotionCard";
import { PromotionFormDrawer } from "~/components/gym/PromotionFormDrawer";
import { PromotionSelectModal } from "~/components/gym/PromotionSelectModal";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { memberMemberships, gymMembers } from "~/data/gym";
import { memberships } from "~/data/catalog";
import { promotions as initialPromotions } from "~/data/promotions";
import { gymApi } from "~/services/gymApi";
import type { GymMember } from "~/types/gym/member";
import type { MemberMembership } from "~/types/gym/member-membership";
import type { Promotion } from "~/types/gym/promotion";

export default function MembresiasGym() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] =
    useState<MemberMembership[]>(memberMemberships);
  const [editingAssignment, setEditingAssignment] =
    useState<MemberMembership | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMembershipId, setSelectedMembershipId] = useState<string | null>(
    null
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [members, setMembers] = useState<GymMember[]>(gymMembers);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isMemberSelectOpen, setIsMemberSelectOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<MemberMembership | null>(null);
  const [promotions, setPromotions] =
    useState<Promotion[]>(initialPromotions);
  const [promoCode, setPromoCode] = useState("");
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null
  );
  const [isPromoSelectOpen, setIsPromoSelectOpen] = useState(false);
  const [isPromoFormOpen, setIsPromoFormOpen] = useState(false);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );
  const selectedMembership = useMemo(
    () =>
      memberships.find((membership) => membership.id === selectedMembershipId) ??
      null,
    [selectedMembershipId]
  );
  const selectedPromotion = useMemo(
    () => promotions.find((promo) => promo.id === selectedPromotionId) ?? null,
    [promotions, selectedPromotionId]
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);

    if (!selectedMember || !selectedMembership || !startDate || !endDate) {
      setMessage("Completa la selección de miembro, membresía y fechas.");
      setIsSubmitting(false);
      return;
    }

    const newAssignment: MemberMembership = {
      id: editingAssignment?.id ?? `MBRM-${Date.now()}`,
      memberId: selectedMember.id,
      memberName: `${selectedMember.firstName} ${selectedMember.lastName}`,
      membershipId: selectedMembership.id,
      membershipName: selectedMembership.name,
      startDate,
      endDate,
      status: "Vigente",
    };

    const response = await gymApi.assignMembership(newAssignment);
    setMessage(response.message ?? "Membresía asignada.");
    setAssignments((prev) =>
      editingAssignment
        ? prev.map((item) =>
            item.id === editingAssignment.id ? newAssignment : item
          )
        : [newAssignment, ...prev]
    );
    setEditingAssignment(null);
    setIsSubmitting(false);
  };

  const handlePromoCodeChange = (value: string) => {
    setPromoCode(value);
    const match = promotions.find(
      (promo) => promo.code.toLowerCase() === value.trim().toLowerCase()
    );
    setSelectedPromotionId(match?.id ?? null);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Membresías activas"
        description="Asignación, altas y vencimientos por miembro."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Selecciona la membresía
              </h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {memberships.map((membership) => (
                  <MembershipSelectCard
                    key={membership.id}
                    membership={membership}
                    isSelected={membership.id === selectedMembershipId}
                    onSelect={() => setSelectedMembershipId(membership.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Selecciona el miembro
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberOpen(true)}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    + Nuevo miembro
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMemberSelectOpen(true)}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Miembro existente
                  </button>
                </div>
              </div>
              <div className="mt-3">
                {selectedMember ? (
                  <MemberSelectCard
                    member={selectedMember}
                    isSelected
                    onSelect={() => setSelectedMemberId(selectedMember.id)}
                    onRemove={() => setSelectedMemberId(null)}
                  />
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Selecciona un miembro existente o crea uno nuevo.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Promoción
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPromoSelectOpen(true)}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Seleccionar promoción
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPromoFormOpen(true)}
                    className="rounded-xl border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Crear promoción
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-3">
                <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                  <span className="font-medium">Código promocional</span>
                  <input
                    value={promoCode}
                    onChange={(event) => handlePromoCodeChange(event.target.value)}
                    placeholder="Ingresa el código"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>
                {selectedPromotion ? (
                  <div className="space-y-2">
                    <PromotionCard promotion={selectedPromotion} isSelected />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPromotionId(null);
                        setPromoCode("");
                      }}
                      className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-950/40"
                    >
                      Quitar promoción
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Puedes ingresar un código o seleccionar una promoción del catálogo.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Inicio</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Vencimiento</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span className="font-medium">Método de pago</span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option>Efectivo</option>
                <option>Tarjeta de crédito</option>
                <option>Tarjeta de débito</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Guardando..."
                : editingAssignment
                ? "Actualizar"
                : "Asignar"}
            </button>
            {editingAssignment ? (
              <button
                type="button"
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setEditingAssignment(null)}
              >
                Cancelar edición
              </button>
            ) : null}
            {message ? (
              <p className="text-sm text-emerald-600">{message}</p>
            ) : null}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Membresías por miembro
          </h3>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {assignment.memberName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-amber-600">
                      {assignment.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMemberId(assignment.memberId);
                        setSelectedMembershipId(assignment.membershipId);
                        setStartDate(assignment.startDate);
                        setEndDate(assignment.endDate);
                        setEditingAssignment(assignment);
                      }}
                      className="rounded-full border border-zinc-200 px-2 py-1 text-[10px] font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelTarget(assignment)}
                      className="rounded-full border border-rose-200 px-2 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-950/40"
                    >
                      Dar de baja
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {assignment.membershipName} · {assignment.startDate} → {assignment.endDate}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onCreate={(member) => {
          setMembers((prev) => [member, ...prev]);
          setSelectedMemberId(member.id);
          setIsAddMemberOpen(false);
        }}
      />

      <MemberSelectModal
        isOpen={isMemberSelectOpen}
        members={members}
        selectedMemberId={selectedMemberId}
        onSelect={(member) => {
          setSelectedMemberId(member.id);
          setIsMemberSelectOpen(false);
        }}
        onClose={() => setIsMemberSelectOpen(false)}
      />

      <PromotionSelectModal
        isOpen={isPromoSelectOpen}
        promotions={promotions}
        selectedPromotionId={selectedPromotionId}
        onSelect={(promotion) => {
          setSelectedPromotionId(promotion.id);
          setPromoCode(promotion.code);
          setIsPromoSelectOpen(false);
        }}
        onClose={() => setIsPromoSelectOpen(false)}
      />

      {isPromoFormOpen ? (
        <PromotionFormDrawer
          onClose={() => setIsPromoFormOpen(false)}
          onCreate={(promotion) => {
            setPromotions((prev) => [promotion, ...prev]);
            setSelectedPromotionId(promotion.id);
            setPromoCode(promotion.code);
            setIsPromoFormOpen(false);
          }}
        />
      ) : null}

      <CancelMembershipModal
        isOpen={Boolean(cancelTarget)}
        memberName={cancelTarget?.memberName ?? "miembro"}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => setCancelTarget(null)}
      />
    </div>
  );
}
