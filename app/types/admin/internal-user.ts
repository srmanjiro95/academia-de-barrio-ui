export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface InternalUser {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  emergencyContacts: EmergencyContact[];
}
