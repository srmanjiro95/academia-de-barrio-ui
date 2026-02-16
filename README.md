# Academia de Barrio UI

Frontend de la Academia del Barrio construido con React Router + TypeScript.

## Conexión con backend (`academia-del-barrio`)

La capa `gymApi` ahora puede enviar peticiones reales al backend si configuras una URL base.

1. Define la variable de entorno:

```bash
API_BASE_URL=http://localhost:8000
```

2. Levanta este proyecto normalmente:

```bash
npm run dev
```

3. Si `API_BASE_URL` no está definida, la UI seguirá funcionando en modo simulado (mock) para desarrollo de frontend.

### Endpoints esperados por acción

- `POST /api/internal-users`
- `POST /api/roles`
- `POST /api/memberships`
- `POST /api/products`
- `POST /api/members`
- `POST /api/check-ins`
- `POST /api/fight-records`
- `POST /api/sales`
- `POST /api/member-memberships`
- `POST /api/plans`

> Si en tu backend los paths son distintos, puedes mantener el mismo contrato y crear un router de compatibilidad o ajustar esta tabla en `app/services/gymApi.ts`.

## Scripts

- `npm run dev` - desarrollo
- `npm run build` - build de producción
- `npm run start` - servir build
- `npm run typecheck` - verificación de tipos
