import type { ContactInfo } from "~/types/gym/contact";
import type { GuardianData } from "~/types/gym/guardian";
import type { HealthData } from "~/types/gym/health";
import type { MembershipData } from "~/types/gym/membership-data";

export interface GymMember {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  address: string;
  birthDate?: string;
  health?: HealthData;
  guardian?: GuardianData;
  emergencyContacts?: ContactInfo[];
  status: "Activo" | "Suspendido" | "Baja";
  membership: MembershipData | null;
}
