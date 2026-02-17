import type { GymMember } from "~/types/gym/member";

export const toApiMember = (member: GymMember) => ({
  first_name: member.firstName,
  last_name: member.lastName,
  middle_name: member.middleName,
  email: member.email,
  phone: member.phone,
  address: member.address,
  birth_date: member.birthDate ?? null,
  health: member.health
    ? {
        height: member.health.height ?? null,
        weight: member.health.weight ?? null,
        bmi: member.health.bmi ?? null,
        allergies: member.health.allergies ?? null,
        diseases: member.health.diseases ?? null,
        previous_injuries: member.health.previousInjuries ?? null,
      }
    : null,
  guardian: member.guardian
    ? {
        name: member.guardian.name ?? null,
        phone: member.guardian.phone ?? null,
      }
    : null,
  emergency_contacts: member.emergencyContacts ?? [],
  status: member.status,
  membership_id: member.membership?.id ?? null,
  membership_name: member.membership?.name ?? null,
  image_url: member.imageUrl ?? null,
  qr_uuid: member.qrUuid ?? null,
  qr_image_url: member.qrImageUrl ?? null,
});

export const fromApiMember = (member: any): GymMember => ({
  id: member.id,
  firstName: member.first_name,
  lastName: member.last_name,
  middleName: member.middle_name,
  email: member.email,
  phone: member.phone,
  address: member.address,
  birthDate: member.birth_date ?? undefined,
  health: member.health
    ? {
        height: member.health.height ?? undefined,
        weight: member.health.weight ?? undefined,
        bmi: member.health.bmi ?? undefined,
        allergies: member.health.allergies ?? undefined,
        diseases: member.health.diseases ?? undefined,
        previousInjuries: member.health.previous_injuries ?? undefined,
      }
    : undefined,
  guardian: member.guardian
    ? {
        name: member.guardian.name ?? undefined,
        phone: member.guardian.phone ?? undefined,
      }
    : undefined,
  emergencyContacts: member.emergency_contacts ?? [],
  status: member.status,
  membership:
    member.membership_id || member.membership_name
      ? {
          id: member.membership_id ?? "",
          name: member.membership_name ?? "",
        }
      : null,
  imageUrl: member.image_url ?? undefined,
  qrUuid: member.qr_uuid ?? undefined,
  qrImageUrl: member.qr_image_url ?? undefined,
});
