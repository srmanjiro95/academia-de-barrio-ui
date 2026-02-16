import { FormSection } from "~/components/forms/FormSection";
import { TextField } from "~/components/forms/TextField";

interface EmergencyContactsSectionProps {
  title?: string;
  description?: string;
  includeRelationship?: boolean;
  required?: boolean;
  defaultValues?: {
    contactOneName?: string;
    contactOnePhone?: string;
    contactOneRelationship?: string;
    contactTwoName?: string;
    contactTwoPhone?: string;
    contactTwoRelationship?: string;
  };
}

export function EmergencyContactsSection({
  title = "Contactos de emergencia",
  description,
  includeRelationship = false,
  required = false,
  defaultValues,
}: EmergencyContactsSectionProps) {
  return (
    <FormSection title={title} description={description}>
      <TextField
        label="Contacto 1 - Nombre"
        name="contactOneName"
        placeholder="Nombre completo"
        required={required}
        defaultValue={defaultValues?.contactOneName}
      />
      <TextField
        label="Contacto 1 - Celular"
        name="contactOnePhone"
        placeholder="55 0000 0000"
        required={required}
        defaultValue={defaultValues?.contactOnePhone}
      />
      {includeRelationship ? (
        <TextField
          label="Contacto 1 - Relación"
          name="contactOneRelationship"
          placeholder="Padre, madre, pareja"
          defaultValue={defaultValues?.contactOneRelationship}
        />
      ) : null}
      <TextField
        label="Contacto 2 - Nombre"
        name="contactTwoName"
        placeholder="Nombre completo"
        required={required}
        defaultValue={defaultValues?.contactTwoName}
      />
      <TextField
        label="Contacto 2 - Celular"
        name="contactTwoPhone"
        placeholder="55 0000 0000"
        required={required}
        defaultValue={defaultValues?.contactTwoPhone}
      />
      {includeRelationship ? (
        <TextField
          label="Contacto 2 - Relación"
          name="contactTwoRelationship"
          placeholder="Familiar, amigo"
          defaultValue={defaultValues?.contactTwoRelationship}
        />
      ) : null}
    </FormSection>
  );
}
