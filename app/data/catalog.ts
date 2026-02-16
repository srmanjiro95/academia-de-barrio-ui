import type { Membership } from "~/types/catalog/membership";
import type { Product } from "~/types/catalog/product";

export const memberships: Membership[] = [
  {
    id: "MEM-001",
    name: "Box Fit Mensual",
    price: 950,
    duration: "30 días",
    includes: ["Acceso libre", "Clase grupal", "Evaluación inicial"],
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "MEM-002",
    name: "Box Pro Trimestral",
    price: 2550,
    duration: "90 días",
    includes: ["Acceso libre", "Sparring", "Plan personalizado"],
    imageUrl: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=500&q=80",
  },
];

export const products: Product[] = [
  {
    id: "PROD-001",
    name: "Guantes 14 oz",
    units: 25,
    price: 1200,
    description: "Guantes profesionales de entrenamiento.",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "PROD-002",
    name: "Protector bucal",
    units: 42,
    price: 180,
    description: "Protección ergonómica con funda.",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
  },
];