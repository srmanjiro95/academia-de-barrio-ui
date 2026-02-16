import type { CheckIn } from "~/types/gym/checkin";
import type { DevelopmentPlan } from "~/types/gym/plan";
import type { GymMember } from "~/types/gym/member";
import type { FightRecord } from "~/types/gym/record";
import type { MemberMembership } from "~/types/gym/member-membership";
import type { Sale } from "~/types/gym/sale";
import type { FightLog } from "~/components/gym/MemberDrawer";

export const gymMembers: GymMember[] = [
  {
    id: "MBR-001",
    firstName: "Lucía",
    lastName: "Hernández",
    middleName: "Vega",
    email: "lucia@example.com",
    phone: "55 9898 1212",
    address: "Calle 10 #45, CDMX",
    birthDate: "1996-08-12",
    health: {
      height: 168,
      weight: 62,
      bmi: 22,
      allergies: "Ninguna",
      diseases: "Ninguna",
      previousInjuries: "Esguince leve en 2022",
    },
    emergencyContacts: [
      { name: "Marta Vega", phone: "55 4321 7788" },
      { name: "Raúl Hernández", phone: "55 4455 6677" },
    ],
    status: "Activo",
    membership: {
      id: "MEM-001",
      name: "Box Fit Mensual",
    },
  },
  {
    id: "MBR-002",
    firstName: "Carlos",
    lastName: "Ramírez",
    middleName: "Vega",
    email: "carlos@example.com",
    phone: "55 1111 3333",
    address: "Av. Patriotismo 220, CDMX",
    birthDate: "1992-03-04",
    health: {
      height: 175,
      weight: 78,
      bmi: 25,
      allergies: "Lactosa",
      diseases: "Ninguna",
      previousInjuries: "Lesión en hombro derecho",
    },
    emergencyContacts: [
      { name: "Patricia Vega", phone: "55 6677 8899" },
      { name: "Luis Ramírez", phone: "55 9988 1122" },
    ],
    status: "Suspendido",
    membership: {
      id: "MEM-002",
      name: "Box Pro Trimestral",
    },
  },
  {
    id: "MBR-003",
    firstName: "Sofía",
    lastName: "Navarro",
    middleName: "Luna",
    email: "sofia@example.com",
    phone: "55 2222 4444",
    address: "Calle 5 #120, CDMX",
    birthDate: "2014-09-18",
    health: {
      height: 140,
      weight: 38,
      bmi: 19,
      allergies: "Polen",
      diseases: "Ninguna",
      previousInjuries: "Ninguna",
    },
    guardian: {
      name: "Ana Navarro",
      phone: "55 7788 9900",
    },
    emergencyContacts: [
      { name: "Ana Navarro", phone: "55 7788 9900" },
      { name: "Diego Luna", phone: "55 3344 5566" },
    ],
    status: "Activo",
    membership: {
      id: "MEM-003",
      name: "Kids Boxing Mensual",
    },
  },
  {
    id: "MBR-004",
    firstName: "Mateo",
    lastName: "Cruz",
    middleName: "García",
    email: "mateo@example.com",
    phone: "55 3333 5555",
    address: "Av. Universidad 480, CDMX",
    birthDate: "2009-05-22",
    health: {
      height: 160,
      weight: 52,
      bmi: 20,
      allergies: "Ninguna",
      diseases: "Asma controlada",
      previousInjuries: "Ninguna",
    },
    guardian: {
      name: "Laura Cruz",
      phone: "55 1100 2200",
    },
    emergencyContacts: [
      { name: "Laura Cruz", phone: "55 1100 2200" },
      { name: "Javier García", phone: "55 9900 8800" },
    ],
    status: "Activo",
    membership: {
      id: "MEM-004",
      name: "Box Teens Trimestral",
    },
  },
];

export const checkIns: CheckIn[] = [
  {
    id: "CHK-001",
    memberName: "Lucía Hernández",
    date: "2024-06-12 07:30",
    status: "Aceptado",
  },
  {
    id: "CHK-002",
    memberName: "Carlos Ramírez",
    date: "2024-06-12 08:10",
    status: "Rechazado",
  },
];

export const fightRecords: FightRecord[] = [
  {
    id: "REC-001",
    memberName: "Lucía Hernández",
    category: "Amateur",
    wins: 6,
    losses: 1,
    draws: 0,
    winsByKo: 2,
    winsByPoints: 4,
  },
  {
    id: "REC-002",
    memberName: "Carlos Ramírez",
    category: "Semiprofesional",
    wins: 10,
    losses: 3,
    draws: 1,
    winsByKo: 5,
    winsByPoints: 5,
  },
];

export const sales: Sale[] = [
  {
    id: "SALE-001",
    customer: "Lucía Hernández",
    product: "Guantes 14 oz",
    quantity: 1,
    total: 1200,
    date: "2024-06-11 18:30",
  },
  {
    id: "SALE-002",
    customer: "Cliente externo",
    product: "Protector bucal",
    quantity: 2,
    total: 360,
    date: "2024-06-11 19:10",
  },
];

export const memberMemberships: MemberMembership[] = [
  {
    id: "MBRM-001",
    memberId: "MBR-001",
    memberName: "Lucía Hernández",
    membershipId: "MEM-001",
    membershipName: "Box Fit Mensual",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: "Vigente",
  },
  {
    id: "MBRM-002",
    memberId: "MBR-002",
    memberName: "Carlos Ramírez",
    membershipId: "MEM-002",
    membershipName: "Box Pro Trimestral",
    startDate: "2024-03-20",
    endDate: "2024-06-20",
    status: "Por vencer",
  },
];

export const developmentPlans: DevelopmentPlan[] = [
  {
    id: "PLAN-001",
    memberIds: ["MBR-001"],
    name: "Plan Fortaleza",
    focus: "Resistencia y defensa",
    description: "Rutina enfocada en cardio, guardia y contragolpe.",
    coach: "Coach Mariana",
    sessionsPerWeek: 4,
  },
  {
    id: "PLAN-002",
    memberIds: ["MBR-002"],
    name: "Plan Explosivo",
    focus: "Potencia y velocidad",
    description: "Trabajo de potencia en combinaciones y explosividad.",
    coach: "Coach Roberto",
    sessionsPerWeek: 5,
  },
];

export const fightLogsByMember: Record<string, FightLog[]> = {
  "MBR-001": [
    {
      id: "LOG-MBR-001-01",
      date: "2024-06-12",
      category: "Amateur",
      result: "Victoria",
      method: "KO",
      opponent: "Carlos Vega",
      location: "Arena Norte CDMX",
      notes: "Control de distancia y cierre en el 2do round.",
      evidenceCount: 2,
      hasEvidence: true,
    },
    {
      id: "LOG-MBR-001-02",
      date: "2024-05-28",
      category: "Sparring",
      result: "Derrota",
      method: "Puntos",
      opponent: "Luis Ramos",
      location: "Gimnasio Central",
      notes: "Trabajar defensa de jab y contragolpe.",
      evidenceCount: 0,
      hasEvidence: false,
    },
    {
      id: "LOG-MBR-001-03",
      date: "2024-04-10",
      category: "Semiprofesional",
      result: "Victoria",
      method: "Puntos",
      opponent: "Erick Morales",
      location: "Arena Sur",
      notes: "Buen control de ritmo en rounds finales.",
      evidenceCount: 1,
      hasEvidence: true,
    },
    {
      id: "LOG-MBR-001-04",
      date: "2024-03-02",
      category: "Profesional",
      result: "Empate",
      method: "N/A",
      opponent: "Marco Díaz",
      location: "Foro Deportivo León",
      notes: "Igualdad tras 3 rounds, revisar guardia alta.",
      evidenceCount: 3,
      hasEvidence: true,
    },
    {
      id: "LOG-MBR-001-05",
      date: "2024-02-18",
      category: "Amateur",
      result: "Victoria",
      method: "KO",
      opponent: "Daniel Torres",
      location: "Auditorio Roma",
      notes: "Uppercut decisivo en el 1er round.",
      evidenceCount: 2,
      hasEvidence: true,
    },
  ],
  "MBR-002": [
    {
      id: "LOG-MBR-002-01",
      date: "2024-06-05",
      category: "Semiprofesional",
      result: "Derrota",
      method: "Puntos",
      opponent: "Iván Cruz",
      location: "Centro Deportivo Toluca",
      notes: "Faltó volumen de golpes en el cierre.",
      evidenceCount: 1,
      hasEvidence: true,
    },
    {
      id: "LOG-MBR-002-02",
      date: "2024-05-20",
      category: "Profesional",
      result: "Victoria",
      method: "KO",
      opponent: "Marco Juárez",
      location: "Arena Bajío",
      notes: "Dominio en la corta distancia.",
      evidenceCount: 2,
      hasEvidence: true,
    },
    {
      id: "LOG-MBR-002-03",
      date: "2024-04-12",
      category: "Sparring",
      result: "Empate",
      method: "N/A",
      opponent: "José Martínez",
      location: "Gimnasio Central",
      notes: "Mantener ritmo constante durante 4 rounds.",
      evidenceCount: 0,
      hasEvidence: false,
    },
    {
      id: "LOG-MBR-002-04",
      date: "2024-03-08",
      category: "Semiprofesional",
      result: "Victoria",
      method: "Puntos",
      opponent: "Álvaro Díaz",
      location: "Coliseo Puebla",
      notes: "Mejorar esquivas laterales.",
      evidenceCount: 1,
      hasEvidence: true,
    },
    {
      id: "LOG-MBR-002-05",
      date: "2024-02-22",
      category: "Amateur",
      result: "Derrota",
      method: "KO",
      opponent: "Sergio Campos",
      location: "Arena Norte CDMX",
      notes: "Reforzar guardia en el 2do round.",
      evidenceCount: 2,
      hasEvidence: true,
    },
  ],
};

export const planMembersByPlan: Record<string, string[]> = {
  "PLAN-001": ["MBR-001"],
  "PLAN-002": ["MBR-002"],
};
