export const navigationSections = [
  {
    title: "Administración",
    items: [
      { label: "Inicio", to: "/" },
      { label: "Usuarios internos", to: "/admin/usuarios-internos" },
      { label: "Roles y permisos", to: "/admin/roles-permisos" },
    ],
  },
  {
    title: "Catálogos",
    items: [
      { label: "Membresías", to: "/catalogo/membresias" },
      { label: "Promociones", to: "/catalogo/promociones" },
      { label: "Inventario", to: "/catalogo/inventario" },
    ],
  },
  {
    title: "Gimnasio",
    items: [
      { label: "Miembros", to: "/gym/miembros" },
      { label: "Ingresos QR", to: "/gym/ingresos-qr" },
      { label: "Ventas", to: "/gym/ventas" },
      { label: "Membresías activas", to: "/gym/membresias" },
      { label: "Planes de desarrollo", to: "/gym/planes" },
    ],
  },
];
