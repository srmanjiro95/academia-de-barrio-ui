# Academia de Barrio UI

Frontend de la Academia del Barrio construido con React Router + TypeScript.

## Conexión con backend (`academia-del-barrio`)

La capa `api` consume el backend OpenAPI si configuras la URL base.

1. Define la variable de entorno:

```bash
API_BASE_URL=http://localhost:8000
```

2. Levanta este proyecto normalmente:

```bash
npm run dev
```

3. Si `API_BASE_URL` no está definida, la UI sigue funcionando en modo simulado (mock) para desarrollo frontend.

## Estructura de servicios API

- `app/services/api.ts`: punto de entrada agregado con todos los métodos.
- `app/services/api-core.ts`: cliente reusable (`fetchApi`, simulación, configuración base).
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
