import type { DevelopmentPlan } from "~/types/gym/plan";

export const toApiPlan = (plan: DevelopmentPlan) => ({
  name: plan.name,
  description: plan.description,
  member_id: plan.memberId ?? "",
  member_name: plan.memberName,
  focus: plan.focus,
  coach: plan.coach,
  sessions_per_week: plan.sessionsPerWeek,
});

export const fromApiPlan = (plan: any): DevelopmentPlan => ({
  id: plan.id,
  name: plan.name,
  description: plan.description,
  memberId: plan.member_id,
  memberName: plan.member_name,
  focus: plan.focus,
  coach: plan.coach,
  sessionsPerWeek: plan.sessions_per_week,
});
