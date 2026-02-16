export interface FightRecord {
  id: string;
  memberName: string;
  category: "Sparring" | "Amateur" | "Semiprofesional" | "Profesional";
  wins: number;
  losses: number;
  draws: number;
  winsByKo: number;
  winsByPoints: number;
}
