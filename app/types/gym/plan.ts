export interface DevelopmentPlan {
  id: string;
  name: string;
  description: string;
  memberId?: string;
  memberName: string;
  focus: string;
  coach: string;
  sessionsPerWeek: number;
}
