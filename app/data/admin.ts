import type { InternalUser } from "~/types/admin/internal-user";
import type { Role } from "~/types/admin/role";

export const internalUsers: InternalUser[] = [
  {
    id: "IU-001",
    firstName: "Andrea",
    lastName: "Santos",
    middleName: "López",
    email: "andrea@gym.mx",
    phone: "55 1234 5678",
    address: "Av. Reforma 120, CDMX",
    role: "Coordinación",
    emergencyContacts: [
      { name: "Marco Santos", phone: "55 2100 0001", relationship: "Padre" },
      { name: "Karla Díaz", phone: "55 2100 0002", relationship: "Amiga" },
    ],
  },
  {
    id: "IU-002",
    firstName: "Iván",
    lastName: "Domínguez",
    middleName: "Pérez",
    email: "ivan@gym.mx",
    phone: "55 4433 2200",
    address: "Insurgentes Sur 912, CDMX",
    role: "Recepción",
    emergencyContacts: [
      { name: "Luis Domínguez", phone: "55 3333 1111", relationship: "Hermano" },
      { name: "Mónica Rojas", phone: "55 3333 2222", relationship: "Pareja" },
    ],
  },
];

export const roles: Role[] = [
  {
    id: "ROL-ADM",
    name: "Administrador",
    permissions: ["Usuarios", "Inventario", "Membresías", "Reportes"],
  },
  {
    id: "ROL-REC",
    name: "Recepción",
    permissions: ["Ingresos", "Ventas", "Miembros"],
  },
  {
    id: "ROL-ENT",
    name: "Entrenador",
    permissions: ["Planes", "Record personal", "Miembros"],
  },
];