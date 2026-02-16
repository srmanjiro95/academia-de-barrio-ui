export interface ApiResult<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL?.trim();
  if (!baseUrl) return null;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function createUrl(path: string, query?: Record<string, string | number>) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;
  const url = new URL(`${baseUrl}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function fetchApi<TResponse>(
  path: string,
  options: RequestInit = {},
  query?: Record<string, string | number>
): Promise<ApiResult<TResponse>> {
  const url = createUrl(path, query);

  if (!url) {
    return {
      ok: false,
      data: null as TResponse,
      message: "API_BASE_URL no está configurada.",
    };
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    if (!response.ok) {
      const details = await response.text();
      return {
        ok: false,
        data: null as TResponse,
        message: `Error ${response.status}: ${details || response.statusText}`,
      };
    }

    const body = (await response.json().catch(() => null)) as TResponse;

    return {
      ok: true,
      data: body,
    };
  } catch (error) {
    return {
      ok: false,
      data: null as TResponse,
      message:
        error instanceof Error
          ? `No se pudo conectar con backend: ${error.message}`
          : "No se pudo conectar con backend.",
    };
  }
}
