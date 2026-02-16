// ~/services/cache/redis.cache.ts
import Redis from "ioredis";
import type { CryptoSymbol } from "~/types/crypto";
import { fetchUsd } from "~/services/coinbase/coinbase.server";

const redis = new Redis(process.env.REDIS_URL!, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on("error", (err) => {
  console.warn("[redis] connection error:", err.message);
});

// ---- Configuración ----
const CACHE_TTL_SECONDS = 15;
const LOCK_TTL_SECONDS = 5;
const WAIT_MS = 250;
const MAX_WAIT_ATTEMPTS = 5;

// ---- Helpers ----
function buildCacheKey(symbols: CryptoSymbol[]) {
  return `coinbase:spot:usd:${[...symbols].sort().join(",")}`;
}

function buildLockKey(symbols: CryptoSymbol[]) {
  return `lock:coinbase:spot:usd:${[...symbols].sort().join(",")}`;
}

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// ---- Public API ----
export async function fetchUsdRedisCached(
  symbols: CryptoSymbol[]
): Promise<Record<CryptoSymbol, number>> {
  if (!process.env.REDIS_URL) {
    const prices = await Promise.all(
      symbols.map(async (s) => [s, await fetchUsd(s)] as const)
    );
    return Object.fromEntries(prices) as Record<CryptoSymbol, number>;
  }

  const cacheKey = buildCacheKey(symbols);
  const lockKey = buildLockKey(symbols);

  // 1️⃣ Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Redis down → ignore
  }

  // 2️⃣ Try acquire lock
  let hasLock = false;
  try {
    const locked = await redis.setnx(lockKey, "1");

    if (locked === 1) {
        hasLock = true;
        // TTL del lock (anti-deadlock)
        await redis.expire(lockKey, LOCK_TTL_SECONDS);
    }
  } catch {
    // Redis error → skip lock
  }

  // 3️⃣ If lock acquired → fetch + populate cache
  if (hasLock) {
    try {
      const prices = await Promise.all(
        symbols.map(async (s) => [s, await fetchUsd(s)] as const)
      );

      const map = Object.fromEntries(prices) as Record<CryptoSymbol, number>;

      try {
        await redis.set(
          cacheKey,
          JSON.stringify(map),
          "EX",
          CACHE_TTL_SECONDS
        );
      } catch {
        // ignore redis write errors
      }

      return map;
    } finally {
      // lock expires automatically, no DEL needed
    }
  }

  // 4️⃣ Lock not acquired → wait & retry cache
  for (let i = 0; i < MAX_WAIT_ATTEMPTS; i++) {
    await sleep(WAIT_MS);

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
  }

  // 5️⃣ Fallback (worst case)
  const prices = await Promise.all(
    symbols.map(async (s) => [s, await fetchUsd(s)] as const)
  );

  return Object.fromEntries(prices) as Record<CryptoSymbol, number>;
}
