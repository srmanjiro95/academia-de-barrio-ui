import { useEffect, useMemo, useState } from "react";
import { FileField } from "~/components/forms/FileField";
import { FormSection } from "~/components/forms/FormSection";
import { EmergencyContactsSection } from "~/components/forms/EmergencyContactsSection";
import { GuardianSection } from "~/components/forms/GuardianSection";
import { SelectField } from "~/components/forms/SelectField";
import { BirthDateField } from "~/components/forms/BirthDateField";
import { TextAreaField } from "~/components/forms/TextAreaField";
import { TextField } from "~/components/forms/TextField";
import { api } from "~/services/api";
import type { GymMember } from "~/types/gym/member";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (member: GymMember) => void;
  membershipOptions?: Array<{ id: string; name: string }>;
}

export function AddMemberModal({
  isOpen,
  onClose,
  onCreate,
  membershipOptions = [],
}: AddMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [membershipId, setMembershipId] = useState("none");
  const [message, setMessage] = useState<string | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setBirthDate("");
      setMembershipId("none");
      setMessage(null);
    }
  }, [isOpen]);

  const selectedMembership = useMemo(
    () => membershipOptions.find((membership) => membership.id === membershipId) ?? null,
    [membershipId, membershipOptions]
  );

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as Record<string, string>;
    const imageFile = formData.get("imageFile");

    let imageUrl = "";

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploadResponse = await api.uploadImage(imageFile, "members");
      if (!uploadResponse.ok) {
        setMessage(uploadResponse.message ?? "No se pudo subir la foto del miembro.");
        setIsSubmitting(false);
        return;
      }
      imageUrl = uploadResponse.data.image_url;
    }

    const manualMembershipName = payload.membership?.trim();

    const memberPayload: GymMember = {
      id: `MBR-${Date.now()}`,
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
      membership: selectedMembership
        ? { id: selectedMembership.id, name: selectedMembership.name }
        : manualMembershipName
          ? { id: `MEM-${Date.now()}`, name: manualMembershipName }
          : null,
      imageUrl: imageUrl || undefined,
    };

    const response = await api.createMember(memberPayload);
    if (!response.ok) {
      setMessage(response.message ?? "No se pudo registrar el miembro.");
      setIsSubmitting(false);
      return;
    }

    onCreate(response.data);
    setBirthDate("");
    setMembershipId("none");
    setFormVersion((prev) => prev + 1);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar alta de miembro"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Alta rápida de miembro
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Completa los datos del miembro para registrarlo y asignar la membresía.
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

        <form key={`new-${formVersion}`} onSubmit={handleSubmit} className="mt-6 space-y-6">
          <FormSection title="Datos del miembro">
            <FileField label="Foto" name="imageFile" accept="image/*" />
            <TextField label="Nombre" name="firstName" required />
            <TextField label="Apellido paterno" name="lastName" required />
            <TextField label="Apellido materno" name="middleName" />
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
            <TextField label="Celular" name="phone" required />
            <TextField label="Correo" name="email" type="email" required />
            <SelectField
              label="Estatus"
              name="status"
              options={[
                { label: "Activo", value: "Activo" },
                { label: "Suspendido", value: "Suspendido" },
                { label: "Baja", value: "Baja" },
              ]}
            />
            <TextField label="Membresía asignada" name="membership" placeholder="Sin asignar" />
            <SelectField
              label="Catálogo de membresías"
              name="membershipId"
              options={[
                { label: "Sin asignar", value: "none" },
                ...membershipOptions.map((membership) => ({
                  label: membership.name,
                  value: membership.id,
                })),
              ]}
              value={membershipId}
              onChange={(event) => setMembershipId(event.target.value)}
            />
          </FormSection>

          <FormSection title="Datos físicos">
            <TextField label="Estatura (cm)" name="height" type="number" />
            <TextField label="Peso (kg)" name="weight" type="number" />
            <TextField label="IMC" name="bmi" type="number" />
            <TextAreaField
              label="Alergias"
              name="allergies"
              placeholder="Describe alergias relevantes"
              className="md:col-span-2"
            />
            <TextAreaField
              label="Enfermedades"
              name="diseases"
              placeholder="Describe enfermedades relevantes"
              className="md:col-span-2"
            />
            <TextAreaField
              label="Lesiones previas"
              name="previousInjuries"
              placeholder="Describe lesiones previas"
              className="md:col-span-2"
            />
          </FormSection>

          <FormSection title="Dirección">
            <TextAreaField
              label="Dirección completa"
              name="address"
              placeholder="Calle, número, ciudad"
              className="md:col-span-2"
              required
            />
          </FormSection>

          <EmergencyContactsSection />

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
            return age >= 4 && age <= 17 ? <GuardianSection /> : null;
          })()}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Registrar miembro"}
            </button>
            {message ? <span className="text-sm text-emerald-600">{message}</span> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
