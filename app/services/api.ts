import type { ApiResult } from "~/services/api-core";
import type { Membership } from "~/types/catalog/membership";
import type { Product } from "~/types/catalog/product";
import type { InternalUser } from "~/types/admin/internal-user";
import type { Role } from "~/types/admin/role";
import type { GymMember } from "~/types/gym/member";
import type { CheckIn } from "~/types/gym/checkin";
import type { FightRecord } from "~/types/gym/record";
import type { Sale } from "~/types/gym/sale";
import type { MemberMembership } from "~/types/gym/member-membership";
import type { DevelopmentPlan } from "~/types/gym/plan";
import type { Promotion } from "~/types/gym/promotion";
import type { UploadImageResponse } from "~/services/modules/uploads/service";
import {
  listMemberships,
  createMembership,
} from "~/services/modules/memberships/service";
import { listProducts, createProduct } from "~/services/modules/products/service";
import {
  listPromotions,
  createPromotion,
} from "~/services/modules/promotions/service";
import { listRoles, createRole } from "~/services/modules/roles/service";
import {
  listInternalUsers,
  createInternalUser,
} from "~/services/modules/internal-users/service";
import {
  listMembers,
  createMember,
  refreshMemberQr,
} from "~/services/modules/members/service";
import {
  listCheckIns,
  registerCheckIn,
} from "~/services/modules/check-ins/service";
import {
  listRecords,
  registerRecord,
} from "~/services/modules/records/service";
import { listSales, registerSale } from "~/services/modules/sales/service";
import {
  listMemberMemberships,
  assignMembership,
} from "~/services/modules/member-memberships/service";
import { listPlans, createPlan } from "~/services/modules/plans/service";
import { uploadImage } from "~/services/modules/uploads/service";

export type { ApiResult } from "~/services/api-core";

interface ApiContract {
  listMemberships: () => Promise<ApiResult<Membership[]>>;
  createMembership: (payload: Membership) => Promise<ApiResult<Membership>>;
  listProducts: () => Promise<ApiResult<Product[]>>;
  createProduct: (payload: Product) => Promise<ApiResult<Product>>;
  listPromotions: () => Promise<ApiResult<Promotion[]>>;
  createPromotion: (payload: Promotion) => Promise<ApiResult<Promotion>>;
  listRoles: () => Promise<ApiResult<Role[]>>;
  createRole: (payload: Role) => Promise<ApiResult<Role>>;
  listInternalUsers: () => Promise<ApiResult<InternalUser[]>>;
  createInternalUser: (payload: InternalUser) => Promise<ApiResult<InternalUser>>;
  listMembers: () => Promise<ApiResult<GymMember[]>>;
  createMember: (payload: GymMember) => Promise<ApiResult<GymMember>>;
  refreshMemberQr: (memberId: string) => Promise<ApiResult<GymMember>>;
  listCheckIns: () => Promise<ApiResult<CheckIn[]>>;
  registerCheckIn: (payload: CheckIn) => Promise<ApiResult<CheckIn>>;
  listRecords: () => Promise<ApiResult<FightRecord[]>>;
  registerRecord: (payload: FightRecord) => Promise<ApiResult<FightRecord>>;
  listSales: () => Promise<ApiResult<Sale[]>>;
  registerSale: (payload: Sale) => Promise<ApiResult<Sale>>;
  listMemberMemberships: () => Promise<ApiResult<MemberMembership[]>>;
  assignMembership: (payload: MemberMembership) => Promise<ApiResult<MemberMembership>>;
  listPlans: () => Promise<ApiResult<DevelopmentPlan[]>>;
  createPlan: (payload: DevelopmentPlan) => Promise<ApiResult<DevelopmentPlan>>;
  uploadImage: (file: File, folder?: string) => Promise<ApiResult<UploadImageResponse>>;
}

export const api: ApiContract = {
  listMemberships,
  createMembership,
  listProducts,
  createProduct,
  listPromotions,
  createPromotion,
  listRoles,
  createRole,
  listInternalUsers,
  createInternalUser,
  listMembers,
  createMember,
  refreshMemberQr,
  listCheckIns,
  registerCheckIn,
  listRecords,
  registerRecord,
  listSales,
  registerSale,
  listMemberMemberships,
  assignMembership,
  listPlans,
  createPlan,
  uploadImage,
};
