import type { Promotion } from "~/types/gym/promotion";

export const promotions: Promotion[] = [
  {
    id: "PROMO-001",
    title: "Inscripción gratis julio",
    type: "Inscripción",
    amount: 1,
    description: "Exención del pago de inscripción durante julio.",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    code: "JULIO-INSCRIP",
    status: "Activo",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "PROMO-002",
    title: "20% off anualidad",
    type: "Descuento",
    discountType: "Porcentaje",
    amount: 20,
    description: "Descuento del 20% en anualidades seleccionadas.",
    startDate: "2024-06-15",
    endDate: "2024-08-31",
    code: "ANUAL-20",
    status: "Activo",
    imageUrl:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "PROMO-003",
    title: "$200 MXN de descuento",
    type: "Descuento",
    discountType: "Monto fijo",
    amount: 200,
    description: "Aplicable a membresías trimestrales.",
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    code: "DESC-200",
    status: "Inactivo",
    imageUrl:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=500&q=80",
  },
];
