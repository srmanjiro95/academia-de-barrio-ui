export interface ApiResult<T> {
  ok: boolean;
  data: T;
  message?: string;
}

type RuntimeEnv = {
  API_BASE_URL?: string;
  VITE_API_BASE_URL?: string;
};

function getRuntimeEnv(): RuntimeEnv {
  try {
    return (import.meta as ImportMeta & { env?: RuntimeEnv }).env ?? {};
  } catch {
    return {};
  }
}

function normalizeBaseUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function getApiBaseUrl() {
  const env = getRuntimeEnv();

  return (
    normalizeBaseUrl(env.VITE_API_BASE_URL) ??
    normalizeBaseUrl(env.API_BASE_URL)
  );
}

function createUrl(path: string, query?: Record<string, string | number>) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

function buildHeaders(options: RequestInit): HeadersInit {
  const headers = new Headers(options.headers ?? {});
  const method = (options.method ?? "GET").toUpperCase();

  const hasBody = options.body !== undefined && options.body !== null;
  const isFormDataBody = typeof FormData !== "undefined" && options.body instanceof FormData;
  const shouldSetJsonContentType = hasBody && method !== "GET" && method !== "HEAD";

  if (shouldSetJsonContentType && !isFormDataBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
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
      message:
        "No se encontró la URL del backend. Configura VITE_API_BASE_URL (o API_BASE_URL).",
    };
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: buildHeaders(options),
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
