import type { InternalUser } from "~/types/admin/internal-user";
import type { Role } from "~/types/admin/role";
import type { Membership } from "~/types/catalog/membership";
import type { Product } from "~/types/catalog/product";
import type { CheckIn } from "~/types/gym/checkin";
import type { DevelopmentPlan } from "~/types/gym/plan";
import type { GymMember } from "~/types/gym/member";
import type { FightRecord } from "~/types/gym/record";
import type { MemberMembership } from "~/types/gym/member-membership";
import type { Promotion } from "~/types/gym/promotion";
import type { Sale } from "~/types/gym/sale";

export interface ApiResult<T> {
  ok: boolean;
  data: T;
  message?: string;
}

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL?.trim();
  if (!baseUrl) return null;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

async function simulateCreate<T>(data: T): Promise<ApiResult<T>> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    ok: true,
    data,
    message:
      "Sin API configurada (API_BASE_URL). Respuesta simulada para desarrollo UI.",
  };
}

function createUrl(path: string, query?: Record<string, string | number>) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;
  const url = new URL(`${baseUrl}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function fetchApi<TResponse>(
  path: string,
  options: RequestInit = {},
  query?: Record<string, string | number>
): Promise<ApiResult<TResponse>> {
  const url = createUrl(path, query);

  if (!url) {
    return {
      ok: false,
      data: null as TResponse,
      message: "API_BASE_URL no está configurada.",
    };
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    if (!response.ok) {
      const details = await response.text();
      return {
        ok: false,
        data: null as TResponse,
        message: `Error ${response.status}: ${details || response.statusText}`,
      };
    }

    const body = (await response.json().catch(() => null)) as TResponse;

    return {
      ok: true,
      data: body,
    };
  } catch (error) {
    return {
      ok: false,
      data: null as TResponse,
      message:
        error instanceof Error
          ? `No se pudo conectar con backend: ${error.message}`
          : "No se pudo conectar con backend.",
    };
  }
}

const toMembershipPayload = (membership: Membership) => ({
  name: membership.name,
  price: membership.price,
  duration: membership.duration,
  includes: membership.includes,
  image_url: membership.imageUrl ?? "",
});

const toProductPayload = (product: Product) => ({
  name: product.name,
  units: product.units,
  price: product.price,
  description: product.description,
  image_url: product.imageUrl ?? "",
});

const toPromotionPayload = (promotion: Promotion) => ({
  title: promotion.title,
  type: promotion.type,
  discount_type: promotion.discountType ?? null,
  amount: promotion.amount,
  description: promotion.description,
  start_date: promotion.startDate,
  end_date: promotion.endDate,
  code: promotion.code,
  status: promotion.status,
  image_url: promotion.imageUrl,
});

const toRolePayload = (role: Role) => ({
  name: role.name,
  permission_ids: role.permissions.map((permission) => permission.id),
});

const toInternalUserPayload = (user: InternalUser) => ({
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

const toGymMemberPayload = (member: GymMember) => ({
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
});

const toRecordPayload = (record: FightRecord) => ({
  member_id: record.memberId ?? "",
  member_name: record.memberName,
  category: record.category,
  wins: record.wins,
  losses: record.losses,
  draws: record.draws,
  wins_by_ko: record.winsByKo,
  wins_by_points: record.winsByPoints,
});

const toCheckInPayload = (checkIn: CheckIn) => ({
  member_id: checkIn.memberId ?? "",
  member_name: checkIn.memberName,
  date: checkIn.date,
  status: checkIn.status,
});

const toSalePayload = (sale: Sale) => ({
  customer: sale.customer,
  product_id: sale.productId ?? sale.product,
  product: sale.product,
  quantity: sale.quantity,
  total: sale.total,
  date: sale.date,
});

const toMemberMembershipPayload = (membership: MemberMembership) => ({
  member_id: membership.memberId,
  member_name: membership.memberName,
  membership_id: membership.membershipId,
  membership_name: membership.membershipName,
  start_date: membership.startDate,
  end_date: membership.endDate,
  status: membership.status,
});

const toPlanPayload = (plan: DevelopmentPlan) => ({
  name: plan.name,
  description: plan.description,
  member_id: plan.memberId ?? "",
  member_name: plan.memberName,
  focus: plan.focus,
  coach: plan.coach,
  sessions_per_week: plan.sessionsPerWeek,
});

const fromMembership = (membership: any): Membership => ({
  id: membership.id,
  name: membership.name,
  price: membership.price,
  duration: membership.duration,
  includes: membership.includes ?? [],
  imageUrl: membership.image_url,
});

const fromProduct = (product: any): Product => ({
  id: product.id,
  name: product.name,
  units: product.units,
  price: product.price,
  description: product.description,
  imageUrl: product.image_url,
});

const fromPromotion = (promotion: any): Promotion => ({
  id: promotion.id,
  title: promotion.title,
  type: promotion.type,
  discountType: promotion.discount_type ?? undefined,
  amount: promotion.amount,
  description: promotion.description,
  startDate: promotion.start_date,
  endDate: promotion.end_date,
  code: promotion.code,
  status: promotion.status,
  imageUrl: promotion.image_url,
});

const fromRole = (role: any): Role => ({
  id: role.id,
  name: role.name,
  permissions: role.permissions ?? [],
});

const fromInternalUser = (user: any): InternalUser => ({
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

const fromMember = (member: any): GymMember => ({
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
});

const fromCheckIn = (checkIn: any): CheckIn => ({
  id: checkIn.id,
  memberId: checkIn.member_id,
  memberName: checkIn.member_name,
  date: checkIn.date,
  status: checkIn.status,
});

const fromSale = (sale: any): Sale => ({
  id: sale.id,
  customer: sale.customer,
  productId: sale.product_id,
  product: sale.product,
  quantity: sale.quantity,
  total: sale.total,
  date: sale.date,
});

const fromRecord = (record: any): FightRecord => ({
  id: record.id,
  memberId: record.member_id,
  memberName: record.member_name,
  category: record.category,
  wins: record.wins,
  losses: record.losses,
  draws: record.draws,
  winsByKo: record.wins_by_ko,
  winsByPoints: record.wins_by_points,
});

const fromMemberMembership = (membership: any): MemberMembership => ({
  id: membership.id,
  memberId: membership.member_id,
  memberName: membership.member_name,
  membershipId: membership.membership_id,
  membershipName: membership.membership_name,
  startDate: membership.start_date,
  endDate: membership.end_date,
  status: membership.status,
});

const fromPlan = (plan: any): DevelopmentPlan => ({
  id: plan.id,
  name: plan.name,
  description: plan.description,
  memberId: plan.member_id,
  memberName: plan.member_name,
  focus: plan.focus,
  coach: plan.coach,
  sessionsPerWeek: plan.sessions_per_week,
});

export const gymApi = {
  listMemberships: async () => {
    const response = await fetchApi<any[]>("/catalog/memberships");
    return response.ok
      ? { ok: true, data: response.data.map(fromMembership) }
      : ({ ...response, data: [] } as ApiResult<Membership[]>);
  },
  createMembership: async (payload: Membership) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/catalog/memberships", {
      method: "POST",
      body: JSON.stringify(toMembershipPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromMembership(response.data), message: "Membresía creada." }
      : ({ ...response, data: payload } as ApiResult<Membership>);
  },
  listProducts: async () => {
    const response = await fetchApi<any[]>("/catalog/inventory");
    return response.ok
      ? { ok: true, data: response.data.map(fromProduct) }
      : ({ ...response, data: [] } as ApiResult<Product[]>);
  },
  createProduct: async (payload: Product) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/catalog/inventory", {
      method: "POST",
      body: JSON.stringify(toProductPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromProduct(response.data), message: "Producto creado." }
      : ({ ...response, data: payload } as ApiResult<Product>);
  },
  listPromotions: async () => {
    const response = await fetchApi<any[]>("/catalog/promotions");
    return response.ok
      ? { ok: true, data: response.data.map(fromPromotion) }
      : ({ ...response, data: [] } as ApiResult<Promotion[]>);
  },
  createPromotion: async (payload: Promotion) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/catalog/promotions", {
      method: "POST",
      body: JSON.stringify(toPromotionPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromPromotion(response.data), message: "Promoción creada." }
      : ({ ...response, data: payload } as ApiResult<Promotion>);
  },
  listRoles: async () => {
    const response = await fetchApi<any[]>("/admin/roles");
    return response.ok
      ? { ok: true, data: response.data.map(fromRole) }
      : ({ ...response, data: [] } as ApiResult<Role[]>);
  },
  createRole: async (payload: Role) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/admin/roles", {
      method: "POST",
      body: JSON.stringify(toRolePayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromRole(response.data), message: "Rol creado." }
      : ({ ...response, data: payload } as ApiResult<Role>);
  },
  listInternalUsers: async () => {
    const response = await fetchApi<any[]>("/admin/internal-users");
    return response.ok
      ? { ok: true, data: response.data.map(fromInternalUser) }
      : ({ ...response, data: [] } as ApiResult<InternalUser[]>);
  },
  createInternalUser: async (payload: InternalUser) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/admin/internal-users", {
      method: "POST",
      body: JSON.stringify(toInternalUserPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromInternalUser(response.data), message: "Usuario creado." }
      : ({ ...response, data: payload } as ApiResult<InternalUser>);
  },
  listMembers: async () => {
    const response = await fetchApi<any[]>("/gym/members");
    return response.ok
      ? { ok: true, data: response.data.map(fromMember) }
      : ({ ...response, data: [] } as ApiResult<GymMember[]>);
  },
  createMember: async (payload: GymMember) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/gym/members", {
      method: "POST",
      body: JSON.stringify(toGymMemberPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromMember(response.data), message: "Miembro creado." }
      : ({ ...response, data: payload } as ApiResult<GymMember>);
  },
  listCheckIns: async () => {
    const response = await fetchApi<any[]>("/gym/ingresos-qr");
    return response.ok
      ? { ok: true, data: response.data.map(fromCheckIn) }
      : ({ ...response, data: [] } as ApiResult<CheckIn[]>);
  },
  registerCheckIn: async (payload: CheckIn) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/gym/ingresos-qr", {
      method: "POST",
      body: JSON.stringify(toCheckInPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromCheckIn(response.data), message: "Ingreso QR registrado." }
      : ({ ...response, data: payload } as ApiResult<CheckIn>);
  },
  listRecords: async () => {
    const response = await fetchApi<any[]>("/admin/personal-records");
    return response.ok
      ? { ok: true, data: response.data.map(fromRecord) }
      : ({ ...response, data: [] } as ApiResult<FightRecord[]>);
  },
  registerRecord: async (payload: FightRecord) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/admin/personal-records", {
      method: "POST",
      body: JSON.stringify(toRecordPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromRecord(response.data), message: "Récord creado." }
      : ({ ...response, data: payload } as ApiResult<FightRecord>);
  },
  listSales: async () => {
    const response = await fetchApi<any[]>("/gym/sales");
    return response.ok
      ? { ok: true, data: response.data.map(fromSale) }
      : ({ ...response, data: [] } as ApiResult<Sale[]>);
  },
  registerSale: async (payload: Sale) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/gym/sales", {
      method: "POST",
      body: JSON.stringify(toSalePayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromSale(response.data), message: "Venta registrada." }
      : ({ ...response, data: payload } as ApiResult<Sale>);
  },
  listMemberMemberships: async () => {
    const response = await fetchApi<any[]>("/gym/memberships");
    return response.ok
      ? { ok: true, data: response.data.map(fromMemberMembership) }
      : ({ ...response, data: [] } as ApiResult<MemberMembership[]>);
  },
  assignMembership: async (payload: MemberMembership) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/gym/memberships", {
      method: "POST",
      body: JSON.stringify(toMemberMembershipPayload(payload)),
    });
    return response.ok
      ? {
          ok: true,
          data: fromMemberMembership(response.data),
          message: "Membresía asignada.",
        }
      : ({ ...response, data: payload } as ApiResult<MemberMembership>);
  },
  listPlans: async () => {
    const response = await fetchApi<any[]>("/catalog/plans");
    return response.ok
      ? { ok: true, data: response.data.map(fromPlan) }
      : ({ ...response, data: [] } as ApiResult<DevelopmentPlan[]>);
  },
  createPlan: async (payload: DevelopmentPlan) => {
    if (!getApiBaseUrl()) return simulateCreate(payload);
    const response = await fetchApi<any>("/catalog/plans", {
      method: "POST",
      body: JSON.stringify(toPlanPayload(payload)),
    });
    return response.ok
      ? { ok: true, data: fromPlan(response.data), message: "Plan creado." }
      : ({ ...response, data: payload } as ApiResult<DevelopmentPlan>);
  },
};
