export const PLANS_ENDPOINT = "/catalog/plans";

export const buildPlanEndpoint = (planId: string) => `${PLANS_ENDPOINT}/${planId}`;
