import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { FileField } from "~/components/forms/FileField";
import { FormSection } from "~/components/forms/FormSection";
import { EmergencyContactsSection } from "~/components/forms/EmergencyContactsSection";
import { GuardianSection } from "~/components/forms/GuardianSection";
import { SelectField } from "~/components/forms/SelectField";
import { BirthDateField } from "~/components/forms/BirthDateField";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import {
  type CategoryRecord,
  type FightCategory,
  type MemberDrawerProps,
  MemberDrawer,
  createEmptyRecord,
} from "~/components/gym/MemberDrawer";
import { developmentPlans, fightLogsByMember, gymMembers } from "~/data/gym";
import { memberships } from "~/data/catalog";
import { gymApi } from "~/services/gymApi";
import type { GymMember } from "~/types/gym/member";
import type { DevelopmentPlan } from "~/types/gym/plan";

export default function MiembrosGym() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<GymMember[]>(gymMembers);
  const [editingMember, setEditingMember] = useState<GymMember | null>(null);
  const [drawerMember, setDrawerMember] = useState<GymMember | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [membershipId, setMembershipId] = useState("none");
  const formKey = editingMember?.id ?? "new";
  const [memberRecords, setMemberRecords] = useState<
    Record<string, Record<FightCategory, CategoryRecord>>
  >(() =>
    gymMembers.reduce((acc, member) => {
      acc[member.id] = createEmptyRecord();
      return acc;
    }, {} as Record<string, Record<FightCategory, CategoryRecord>>)
  );
  const [plansCatalog, setPlansCatalog] = useState<DevelopmentPlan[]>(
    developmentPlans
  );
  const [memberPlans, setMemberPlans] = useState<
    Record<string, DevelopmentPlan | null>
  >(() =>
    gymMembers.reduce((acc, member) => {
      acc[member.id] = null;
      return acc;
    }, {} as Record<string, DevelopmentPlan | null>)
  );
  const [fightLogs, setFightLogs] = useState<
    Record<string, MemberDrawerProps["fightLogs"]>
  >(() =>
    gymMembers.reduce((acc, member) => {
      acc[member.id] = fightLogsByMember[member.id] ?? [];
      return acc;
    }, {} as Record<string, MemberDrawerProps["fightLogs"]>)
  );

  useEffect(() => {
    setBirthDate(editingMember?.birthDate ?? "");
    setMembershipId(editingMember?.membership?.id ?? "none");
  }, [editingMember]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    const membershipSelection =
      memberships.find((membership) => membership.id === membershipId) ?? null;
    const manualMembershipName = payload.membership?.trim();

    const newMember: GymMember = {
      id: editingMember?.id ?? `MBR-${Date.now()}`,
      firstName: payload.firstName ?? "",
      lastName: payload.lastName ?? "",
      middleName: payload.middleName ?? "",
      email: payload.email ?? "",
      phone: payload.phone ?? "",
      address: payload.address ?? "",
      birthDate: birthDate || undefined,
      health: {
        height: payload.height ? Number(payload.height) : undefined,
        weight: payload.weight ? Number(payload.weight) : undefined,
        bmi: payload.bmi ? Number(payload.bmi) : undefined,
        allergies: payload.allergies ?? "",
        diseases: payload.diseases ?? "",
        previousInjuries: payload.previousInjuries ?? "",
      },
      guardian: {
        name: payload.guardianName ?? "",
        phone: payload.guardianPhone ?? "",
      },
      emergencyContacts: [
        { name: payload.contactOneName ?? "", phone: payload.contactOnePhone ?? "" },
        { name: payload.contactTwoName ?? "", phone: payload.contactTwoPhone ?? "" },
      ],
      status: (payload.status as GymMember["status"]) ?? "Activo",
      membership: membershipSelection
        ? { id: membershipSelection.id, name: membershipSelection.name }
        : manualMembershipName
        ? { id: `MEM-${Date.now()}`, name: manualMembershipName }
        : null,
    };

    const response = await gymApi.createMember(newMember);
    setMessage(response.message ?? "Miembro registrado.");
    setMembers((prev) =>
      editingMember
        ? prev.map((member) =>
            member.id === editingMember.id ? newMember : member
          )
        : [newMember, ...prev]
    );
    if (!editingMember) {
      setMemberRecords((prev) => ({
        ...prev,
        [newMember.id]: createEmptyRecord(),
      }));
      setMemberPlans((prev) => ({ ...prev, [newMember.id]: null }));
      setFightLogs((prev) => ({ ...prev, [newMember.id]: [] }));
    }
    setEditingMember(null);
    setIsSubmitting(false);
  };

  const activeRecord = useMemo(() => {
    if (!drawerMember) return null;
    return memberRecords[drawerMember.id] ?? createEmptyRecord();
  }, [drawerMember, memberRecords]);

  const updateRecord = (
    memberId: string,
    category: FightCategory,
    updater: (record: CategoryRecord) => CategoryRecord
  ) => {
    setMemberRecords((prev) => {
      const memberRecord = prev[memberId] ?? createEmptyRecord();
      return {
        ...prev,
        [memberId]: {
          ...memberRecord,
          [category]: updater(memberRecord[category]),
        },
      };
    });
  };

  const handleLogFight: MemberDrawerProps["onLogFight"] = (memberId, log) => {
    setFightLogs((prev) => ({
      ...prev,
      [memberId]: [{ ...log, id: `LOG-${Date.now()}` }, ...(prev[memberId] ?? [])],
    }));
  };

  const handleAssignPlan: MemberDrawerProps["onAssignPlan"] = (
    memberId,
    planId
  ) => {
    const selectedPlan = plansCatalog.find((plan) => plan.id === planId) ?? null;
    setMemberPlans((prev) => ({
      ...prev,
      [memberId]: selectedPlan,
    }));
  };

  const handleCreateCustomPlan: MemberDrawerProps["onCreateCustomPlan"] = (
    memberId,
    plan,
    addToCatalog
  ) => {
    if (addToCatalog) {
      setPlansCatalog((prev) => [...prev, plan]);
    }
    setMemberPlans((prev) => ({
      ...prev,
      [memberId]: plan,
    }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Registro de miembros"
        description="Alta, baja y consulta de miembros del gimnasio."
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Datos del miembro">
              <FileField label="Foto" name="photo" accept="image/*" />
              <TextField
                label="Nombre"
                name="firstName"
                required
                defaultValue={editingMember?.firstName}
              />
              <TextField
                label="Apellido paterno"
                name="lastName"
                required
                defaultValue={editingMember?.lastName}
              />
              <TextField
                label="Apellido materno"
                name="middleName"
                defaultValue={editingMember?.middleName}
              />
              <BirthDateField value={birthDate} onChange={setBirthDate} />
              <SelectField
                label="Género"
                name="gender"
                options={[
                  { label: "Femenino", value: "Femenino" },
                  { label: "Masculino", value: "Masculino" },
                  { label: "Otro", value: "Otro" },
                ]}
              />
              <TextField
                label="Celular"
                name="phone"
                placeholder="55 0000 0000"
                required
                defaultValue={editingMember?.phone}
              />
              <TextField
                label="Correo"
                name="email"
                type="email"
                placeholder="miembro@gym.mx"
                required
                defaultValue={editingMember?.email}
              />
              <SelectField
                label="Estatus"
                name="status"
                options={[
                  { label: "Activo", value: "Activo" },
                  { label: "Suspendido", value: "Suspendido" },
                  { label: "Baja", value: "Baja" },
                ]}
              />
              <TextField
                label="Membresía asignada"
                name="membership"
                placeholder="Sin asignar"
                defaultValue={editingMember?.membership?.name}
              />
              <SelectField
                label="Catálogo de membresías"
                name="membershipId"
                options={[
                  { label: "Sin asignar", value: "none" },
                  ...memberships.map((membership) => ({
                    label: membership.name,
                    value: membership.id,
                  })),
                ]}
                value={membershipId}
                onChange={(event) => setMembershipId(event.target.value)}
              />
            </FormSection>

            <FormSection title="Datos físicos">
              <TextField
                label="Estatura (cm)"
                name="height"
                type="number"
                defaultValue={editingMember?.health?.height}
              />
              <TextField
                label="Peso (kg)"
                name="weight"
                type="number"
                defaultValue={editingMember?.health?.weight}
              />
              <TextField
                label="IMC"
                name="bmi"
                type="number"
                defaultValue={editingMember?.health?.bmi}
              />
              <TextAreaField
                label="Alergias"
                name="allergies"
                placeholder="Describe alergias relevantes"
                className="md:col-span-2"
                defaultValue={editingMember?.health?.allergies}
              />
              <TextAreaField
                label="Enfermedades"
                name="diseases"
                placeholder="Describe enfermedades relevantes"
                className="md:col-span-2"
                defaultValue={editingMember?.health?.diseases}
              />
              <TextAreaField
                label="Lesiones previas"
                name="previousInjuries"
                placeholder="Describe lesiones previas"
                className="md:col-span-2"
                defaultValue={editingMember?.health?.previousInjuries}
              />
            </FormSection>

            <FormSection title="Dirección">
              <TextAreaField
                label="Dirección completa"
                name="address"
                placeholder="Calle, número, ciudad"
                className="md:col-span-2"
                required
                defaultValue={editingMember?.address}
              />
            </FormSection>

            <EmergencyContactsSection
              defaultValues={
                editingMember
                  ? {
                      contactOneName: editingMember.emergencyContacts?.[0]?.name,
                      contactOnePhone: editingMember.emergencyContacts?.[0]?.phone,
                      contactTwoName: editingMember.emergencyContacts?.[1]?.name,
                      contactTwoPhone: editingMember.emergencyContacts?.[1]?.phone,
                    }
                  : undefined
              }
            />

            {(() => {
              if (!birthDate) return null;
              const today = new Date();
              const birth = new Date(birthDate);
              let age = today.getFullYear() - birth.getFullYear();
              const monthDiff = today.getMonth() - birth.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birth.getDate())
              ) {
                age -= 1;
              }
              return age >= 4 && age <= 17 ? (
                <GuardianSection
                  defaultValues={{
                    guardianName: editingMember?.guardian?.name,
                    guardianPhone: editingMember?.guardian?.phone,
                  }}
                />
              ) : null;
            })()}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Guardando..."
                  : editingMember
                  ? "Actualizar miembro"
                  : "Registrar miembro"}
              </button>
              {editingMember ? (
                <button
                  type="button"
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  onClick={() => setEditingMember(null)}
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
            Miembros registrados
          </h3>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {members.map((member) => (
              <div
                key={member.id}
                className="w-full rounded-xl border border-zinc-100 p-3 text-left transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/60"
              >
                <button
                  type="button"
                  onClick={() => setDrawerMember(member)}
                  className="w-full text-left"
                >
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {member.firstName} {member.lastName}
                  </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {member.membership?.name ?? "Sin asignar"} · {member.status}
                </p>
                  <p className="mt-1 text-xs">{member.email}</p>
                </button>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(member)}
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
      {drawerMember && activeRecord ? (
        <MemberDrawer
          member={drawerMember}
          activeRecord={activeRecord}
          plansCatalog={plansCatalog}
          assignedPlan={memberPlans[drawerMember.id]}
          fightLogs={fightLogs[drawerMember.id] ?? []}
          onClose={() => setDrawerMember(null)}
          onUpdateRecord={updateRecord}
          onLogFight={handleLogFight}
          onAssignPlan={handleAssignPlan}
          onCreateCustomPlan={handleCreateCustomPlan}
        />
      ) : null}
    </div>
  );
}
