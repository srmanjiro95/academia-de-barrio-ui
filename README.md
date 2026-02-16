# Academia de Barrio UI

Frontend de la Academia del Barrio construido con React Router + TypeScript.

## Conexión con backend (`academia-del-barrio`)

La capa `api` consume el backend OpenAPI usando una URL base por entorno.

1. Crea tu archivo `.env` local (puedes copiar `.env.example`):

```bash
cp .env.example .env
```

2. Define la URL del backend:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

> También se soporta `API_BASE_URL`, pero en cliente se recomienda `VITE_API_BASE_URL`.

3. Levanta este proyecto normalmente:

```bash
npm run dev
```

Si la variable no está definida, la UI mostrará un error de configuración al intentar consumir API.

## Estructura de servicios API

- `app/services/api.ts`: punto de entrada agregado con todos los métodos.
- `app/services/api-core.ts`: cliente reusable (`fetchApi`, configuración base y manejo de errores).
- `app/services/modules/*`: cada recurso en su carpeta con:
  - `constants.ts` (endpoints),
  - `mappers.ts` (payloads/serialización),
  - `service.ts` (funciones por dominio).

## Endpoints base usados

- Catálogo: `/catalog/memberships`, `/catalog/inventory`, `/catalog/promotions`, `/catalog/plans`
- Admin: `/admin/roles`, `/admin/internal-users`, `/admin/personal-records`
- Gym: `/gym/members`, `/gym/memberships`, `/gym/ingresos-qr`, `/gym/sales`

## Scripts

- `npm run dev` - desarrollo
- `npm run build` - build de producción
- `npm run start` - servir build
- `npm run typecheck` - verificación de tipos
