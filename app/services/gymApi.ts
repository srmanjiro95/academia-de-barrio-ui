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

type EndpointKey =
  | "createInternalUser"
  | "createRole"
  | "createMembership"
  | "createProduct"
  | "createMember"
  | "registerCheckIn"
  | "registerRecord"
  | "registerSale"
  | "assignMembership"
  | "createPlan";

const simulatedDelay = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const endpointByAction: Record<EndpointKey, string> = {
  createInternalUser: "/api/internal-users",
  createRole: "/api/roles",
  createMembership: "/api/memberships",
  createProduct: "/api/products",
  createMember: "/api/members",
  registerCheckIn: "/api/check-ins",
  registerRecord: "/api/fight-records",
  registerSale: "/api/sales",
  assignMembership: "/api/member-memberships",
  createPlan: "/api/plans",
};

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL?.trim();
  if (!baseUrl) return null;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

async function simulateRequest<T>(data: T): Promise<ApiResult<T>> {
  await simulatedDelay();
  return {
    ok: true,
    data,
    message:
      "Sin API configurada (API_BASE_URL). Respuesta simulada lista para FastAPI.",
  };
}

async function requestApi<T>(
  action: EndpointKey,
  payload: T
): Promise<ApiResult<T>> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return simulateRequest(payload);
  }

  try {
    const response = await fetch(`${baseUrl}${endpointByAction[action]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const details = await response.text();
      return {
        ok: false,
        data: payload,
        message: `Error ${response.status} al conectar con backend: ${details || response.statusText}`,
      };
    }

    const responseJson = (await response
      .json()
      .catch(() => null)) as Partial<ApiResult<T>> | null;

    return {
      ok: true,
      data: responseJson?.data ?? payload,
      message:
        responseJson?.message ?? "Solicitud enviada correctamente al backend.",
    };
  } catch (error) {
    return {
      ok: false,
      data: payload,
      message:
        error instanceof Error
          ? `No se pudo conectar con backend: ${error.message}`
          : "No se pudo conectar con backend.",
    };
  }
}

export const gymApi = {
  createInternalUser: (payload: InternalUser) =>
    requestApi("createInternalUser", payload),
  createRole: (payload: Role) => requestApi("createRole", payload),
  createMembership: (payload: Membership) =>
    requestApi("createMembership", payload),
  createProduct: (payload: Product) => requestApi("createProduct", payload),
  createMember: (payload: GymMember) => requestApi("createMember", payload),
  registerCheckIn: (payload: CheckIn) =>
    requestApi("registerCheckIn", payload),
  registerRecord: (payload: FightRecord) =>
    requestApi("registerRecord", payload),
  registerSale: (payload: Sale) => requestApi("registerSale", payload),
  assignMembership: (payload: MemberMembership) =>
    requestApi("assignMembership", payload),
  createPlan: (payload: DevelopmentPlan) => requestApi("createPlan", payload),
};
