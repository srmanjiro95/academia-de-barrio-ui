import type { InternalUser } from "~/types/admin/internal-user";

export const toApiInternalUser = (user: InternalUser) => ({
  first_name: user.firstName,
  last_name: user.lastName,
  middle_name: user.middleName,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role_id: null,
  role: user.role || null,
  emergency_contacts: user.emergencyContacts,
});

export const fromApiInternalUser = (user: any): InternalUser => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  middleName: user.middle_name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role ?? "",
  emergencyContacts: user.emergency_contacts ?? [],
});
