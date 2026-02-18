import type { ApiResult } from "~/services/api-core";
import type { Membership } from "~/types/catalog/membership";
import type { Product } from "~/types/catalog/product";
import type { InternalUser } from "~/types/admin/internal-user";
import type { Permissions, Role } from "~/types/admin/role";
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
  updateMembership,
} from "~/services/modules/memberships/service";
import {
  listProducts,
  createProduct,
  updateProduct,
} from "~/services/modules/products/service";
import {
  listPromotions,
  createPromotion,
  updatePromotion,
} from "~/services/modules/promotions/service";
import { listRoles, createRole, updateRole } from "~/services/modules/roles/service";
import {
  listPermissions,
  createPermission,
} from "~/services/modules/permissions/service";
import {
  listInternalUsers,
  createInternalUser,
  updateInternalUser,
} from "~/services/modules/internal-users/service";
import {
  listMembers,
  createMember,
  updateMember,
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
  updateMemberMembership,
} from "~/services/modules/member-memberships/service";
import { listPlans, createPlan, updatePlan } from "~/services/modules/plans/service";
import { uploadImage } from "~/services/modules/uploads/service";

export type { ApiResult } from "~/services/api-core";

interface ApiContract {
  listMemberships: () => Promise<ApiResult<Membership[]>>;
  createMembership: (payload: Membership) => Promise<ApiResult<Membership>>;
  updateMembership: (payload: Membership) => Promise<ApiResult<Membership>>;
  listProducts: () => Promise<ApiResult<Product[]>>;
  createProduct: (payload: Product) => Promise<ApiResult<Product>>;
  updateProduct: (payload: Product) => Promise<ApiResult<Product>>;
  listPromotions: () => Promise<ApiResult<Promotion[]>>;
  createPromotion: (payload: Promotion) => Promise<ApiResult<Promotion>>;
  updatePromotion: (payload: Promotion) => Promise<ApiResult<Promotion>>;
  listRoles: () => Promise<ApiResult<Role[]>>;
  listPermissions: () => Promise<ApiResult<Permissions[]>>;
  createRole: (payload: Role) => Promise<ApiResult<Role>>;
  updateRole: (payload: Role) => Promise<ApiResult<Role>>;
  createPermission: (payload: Permissions) => Promise<ApiResult<Permissions>>;
  listInternalUsers: () => Promise<ApiResult<InternalUser[]>>;
  createInternalUser: (payload: InternalUser) => Promise<ApiResult<InternalUser>>;
  updateInternalUser: (payload: InternalUser) => Promise<ApiResult<InternalUser>>;
  listMembers: () => Promise<ApiResult<GymMember[]>>;
  createMember: (payload: GymMember) => Promise<ApiResult<GymMember>>;
  updateMember: (payload: GymMember) => Promise<ApiResult<GymMember>>;
  refreshMemberQr: (memberId: string) => Promise<ApiResult<GymMember>>;
  listCheckIns: () => Promise<ApiResult<CheckIn[]>>;
  registerCheckIn: (qrUuid: string) => Promise<ApiResult<CheckIn>>;
  listRecords: () => Promise<ApiResult<FightRecord[]>>;
  registerRecord: (payload: FightRecord) => Promise<ApiResult<FightRecord>>;
  listSales: () => Promise<ApiResult<Sale[]>>;
  registerSale: (payload: Sale) => Promise<ApiResult<Sale>>;
  listMemberMemberships: () => Promise<ApiResult<MemberMembership[]>>;
  assignMembership: (payload: MemberMembership) => Promise<ApiResult<MemberMembership>>;
  updateMemberMembership: (payload: MemberMembership) => Promise<ApiResult<MemberMembership>>;
  listPlans: () => Promise<ApiResult<DevelopmentPlan[]>>;
  createPlan: (payload: DevelopmentPlan) => Promise<ApiResult<DevelopmentPlan>>;
  updatePlan: (payload: DevelopmentPlan) => Promise<ApiResult<DevelopmentPlan>>;
  uploadImage: (file: File, folder?: string) => Promise<ApiResult<UploadImageResponse>>;
}

export const api: ApiContract = {
  listMemberships,
  createMembership,
  updateMembership,
  listProducts,
  createProduct,
  updateProduct,
  listPromotions,
  createPromotion,
  updatePromotion,
  listRoles,
  listPermissions,
  createRole,
  updateRole,
  createPermission,
  listInternalUsers,
  createInternalUser,
  updateInternalUser,
  listMembers,
  createMember,
  updateMember,
  refreshMemberQr,
  listCheckIns,
  registerCheckIn,
  listRecords,
  registerRecord,
  listSales,
  registerSale,
  listMemberMemberships,
  assignMembership,
  updateMemberMembership,
  listPlans,
  createPlan,
  updatePlan,
  uploadImage,
};
