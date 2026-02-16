import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { SelectField } from "~/components/forms/SelectField";
import { TextField } from "~/components/forms/TextField";
import { fightRecords, gymMembers } from "~/data/gym";
import { gymApi } from "~/services/gymApi";
import type { FightRecord } from "~/types/gym/record";

export default function RecordPersonal() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(
    gymMembers[0]?.id ?? ""
  );
  const [record, setRecord] = useState<FightRecord>(() => {
    const firstMember = gymMembers[0];
    const existing =
      fightRecords.find(
        (item) =>
          item.memberName === `${firstMember?.firstName} ${firstMember?.lastName}`
      ) ?? fightRecords[0];
    return (
      existing ?? {
        id: `REC-${Date.now()}`,
        memberName: firstMember?.firstName ?? "",
        category: "Sparring",
        wins: 0,
        losses: 0,
        draws: 0,
        winsByKo: 0,
        winsByPoints: 0,
      }
    );
  });

  const selectedMember = useMemo(
    () => gymMembers.find((member) => member.id === selectedMemberId),
    [selectedMemberId]
  );

  const handleMemberChange = (memberId: string) => {
    setSelectedMemberId(memberId);
    const member = gymMembers.find((item) => item.id === memberId);
    const existing =
      fightRecords.find(
        (item) =>
          item.memberName === `${member?.firstName ?? ""} ${member?.lastName ?? ""}`
      ) ?? null;
    setRecord(
      existing ?? {
        id: `REC-${Date.now()}`,
        memberName: `${member?.firstName ?? ""} ${member?.lastName ?? ""}`,
        category: "Sparring",
        wins: 0,
        losses: 0,
        draws: 0,
        winsByKo: 0,
        winsByPoints: 0,
      }
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    const newRecord: FightRecord = {
      id: record.id,
      memberName: `${selectedMember?.firstName ?? ""} ${selectedMember?.lastName ?? ""}`,
      category: (payload.category as FightRecord["category"]) ?? "Sparring",
      wins: Number(payload.wins ?? 0),
      losses: Number(payload.losses ?? 0),
      draws: Number(payload.draws ?? 0),
      winsByKo: Number(payload.winsByKo ?? 0),
      winsByPoints: Number(payload.winsByPoints ?? 0),
    };

    const response = await gymApi.registerRecord(newRecord);
    setMessage(response.message ?? "Record actualizado.");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Perfil del miembro"
        description="Consulta y actualiza el record personal desde el detalle del alumno."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <SelectField
              label="Selecciona un miembro"
              name="memberId"
              options={gymMembers.map((member) => ({
                label: `${member.firstName} ${member.lastName}`,
                value: member.id,
              }))}
              value={selectedMemberId}
              onChange={(event) => handleMemberChange(event.target.value)}
              className="md:col-span-2"
            />
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedMember?.firstName} {selectedMember?.lastName} {selectedMember?.middleName}
              </p>
              <p className="text-xs">{selectedMember?.email}</p>
              <p className="text-xs">{selectedMember?.phone}</p>
              <p className="text-xs">{selectedMember?.address}</p>
            </div>
            <SelectField
              label="Categoría"
              name="category"
              options={[
                { label: "Sparring", value: "Sparring" },
                { label: "Amateur", value: "Amateur" },
                { label: "Semiprofesional", value: "Semiprofesional" },
                { label: "Profesional", value: "Profesional" },
              ]}
              value={record.category}
              onChange={(event) =>
                setRecord((prev) => ({
                  ...prev,
                  category: event.target.value as FightRecord["category"],
                }))
              }
            />
            <TextField
              label="Ganadas"
              name="wins"
              type="number"
              required
              value={record.wins}
              onChange={(event) =>
                setRecord((prev) => ({ ...prev, wins: Number(event.target.value) }))
              }
            />
            <TextField
              label="Perdidas"
              name="losses"
              type="number"
              required
              value={record.losses}
              onChange={(event) =>
                setRecord((prev) => ({ ...prev, losses: Number(event.target.value) }))
              }
            />
            <TextField
              label="Empatadas"
              name="draws"
              type="number"
              required
              value={record.draws}
              onChange={(event) =>
                setRecord((prev) => ({ ...prev, draws: Number(event.target.value) }))
              }
            />
            <TextField
              label="Ganadas por KO"
              name="winsByKo"
              type="number"
              value={record.winsByKo}
              onChange={(event) =>
                setRecord((prev) => ({ ...prev, winsByKo: Number(event.target.value) }))
              }
            />
            <TextField
              label="Ganadas por puntos"
              name="winsByPoints"
              type="number"
              value={record.winsByPoints}
              onChange={(event) =>
                setRecord((prev) => ({
                  ...prev,
                  winsByPoints: Number(event.target.value),
                }))
              }
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Actualizar record"}
            </button>
            {message ? (
              <p className="text-sm text-emerald-600">{message}</p>
            ) : null}
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Records recientes
          </h3>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            {fightRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {record.memberName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {record.category} · {record.wins}W / {record.losses}L / {record.draws}D
                </p>
                <p className="mt-1 text-xs">
                  KO: {record.winsByKo} · Puntos: {record.winsByPoints}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
