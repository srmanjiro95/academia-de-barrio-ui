# Academia de Barrio UI

Frontend de la Academia del Barrio construido con React Router + TypeScript.

## Conexión con backend (`academia-del-barrio`)

La capa `api` consume el backend OpenAPI usando una URL base por entorno.

### Configuración recomendada para desarrollo (evita CORS)

1. Crea tu archivo `.env` local (puedes copiar `.env.example`):

```bash
cp .env.example .env
```

2. Usa proxy local de Vite:

```bash
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8000
```

Con esto, la UI llama a `/api/*` en `localhost:5173` y Vite redirige al backend (`localhost:8000`) sin bloqueo CORS en navegador.

3. Levanta frontend:

```bash
npm run dev
```

> También se soporta `VITE_API_BASE_URL=http://localhost:8000`, pero en ese modo dependes de CORS correcto en backend.

## Si quieres consumir backend directo (sin proxy)

Debes habilitar CORS en FastAPI para tu origen de frontend (`http://localhost:5173`, y opcionalmente `http://localhost:4173` si usas otro puerto).

Ejemplo:

```py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```


## Subida de imágenes (uploads)

La UI ahora envía archivos al endpoint `POST /uploads/image` y usa `image_url` para guardar membresías, inventario, promociones, miembros y usuarios internos.

- Query param `folder` se usa por módulo (`memberships`, `inventory`, `promotions`, `members`, `internal-users`).
- El campo usado del response es `image_url` (no `relative_path`).

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
