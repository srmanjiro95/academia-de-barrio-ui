import { FileField } from "~/components/forms/FileField";
import { FormSection } from "~/components/forms/FormSection";
import { TextField } from "~/components/forms/TextField";

interface GuardianSectionProps {
  defaultValues?: {
    guardianName?: string;
    guardianPhone?: string;
  };
}

export function GuardianSection({ defaultValues }: GuardianSectionProps) {
  return (
    <FormSection title="Tutor (menores de edad)">
      <TextField
        label="Nombre del tutor"
        name="guardianName"
        placeholder="Nombre completo"
        defaultValue={defaultValues?.guardianName}
      />
      <TextField
        label="Teléfono del tutor"
        name="guardianPhone"
        placeholder="55 0000 0000"
        defaultValue={defaultValues?.guardianPhone}
      />
      <FileField
        label="Responsiva firmada"
        name="guardianConsent"
        accept="application/pdf,image/*"
      />
    </FormSection>
  );
}
