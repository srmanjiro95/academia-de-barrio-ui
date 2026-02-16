import type { InternalUser } from "~/types/admin/internal-user";
import type { Role } from "~/types/admin/role";
import type { Membership } from "~/types/catalog/membership";
import type { Product } from "~/types/catalog/product";
import type { CheckIn } from "~/types/gym/checkin";
import type { DevelopmentPlan } from "~/types/gym/plan";
import type { GymMember } from "~/types/gym/member";
import type { FightRecord } from "~/types/gym/record";
import type { MemberMembership } from "~/types/gym/member-membership";
import type { Sale } from "~/types/gym/sale";

export interface ApiResult<T> {
  ok: boolean;
  data: T;
  message?: string;
}

const simulatedDelay = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function simulateRequest<T>(data: T): Promise<ApiResult<T>> {
  await simulatedDelay();
  return {
    ok: true,
    data,
    message: "Solicitud lista para enviar a FastAPI.",
  };
}

export const gymApi = {
  createInternalUser: (payload: InternalUser) =>
    simulateRequest(payload),
  createRole: (payload: Role) => simulateRequest(payload),
  createMembership: (payload: Membership) => simulateRequest(payload),
  createProduct: (payload: Product) => simulateRequest(payload),
  createMember: (payload: GymMember) => simulateRequest(payload),
  registerCheckIn: (payload: CheckIn) => simulateRequest(payload),
  registerRecord: (payload: FightRecord) => simulateRequest(payload),
  registerSale: (payload: Sale) => simulateRequest(payload),
  assignMembership: (payload: MemberMembership) => simulateRequest(payload),
  createPlan: (payload: DevelopmentPlan) => simulateRequest(payload),
};
