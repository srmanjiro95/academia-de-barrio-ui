 import { type RouteConfig, index, route } from "@react-router/dev/routes";
 
 export default [
   route("/", "routes/app.tsx", [
    index("routes/app.index.tsx"),
    route("admin/usuarios-internos", "routes/admin/usuarios-internos.tsx"),
    route("admin/roles-permisos", "routes/admin/roles-permisos.tsx"),
    route("catalogo/membresias", "routes/catalog/membresias.tsx"),
    route("catalogo/inventario", "routes/catalog/inventario.tsx"),
    route("catalogo/promociones", "routes/catalog/promociones.tsx"),
    route("gym/miembros", "routes/gym/miembros.tsx"),
    route("gym/ingresos-qr", "routes/gym/ingresos-qr.tsx"),
    route("gym/ventas", "routes/gym/ventas.tsx"),
    route("gym/membresias", "routes/gym/membresias.tsx"),
    route("gym/planes", "routes/gym/planes.tsx"),
  ]),
 
   // Auth
   route("login", "routes/login.tsx"),
   route("logout", "routes/logout.tsx"),
 ] satisfies RouteConfig;
