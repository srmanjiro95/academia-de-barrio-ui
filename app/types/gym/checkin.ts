export interface CheckIn {
  id: string;
  memberId?: string;
  memberName: string;
  date: string;
  status: "Aceptado" | "Rechazado";
}
