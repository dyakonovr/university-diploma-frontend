import { ref } from 'vue';

type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 1000 * 60 * 5; // 5 min
const MAX_ENTRIES = 100;

function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expiry <= now) {
      cache.delete(key);
    }
  }
}

function enforceMaxSize(): void {
  if (cache.size <= MAX_ENTRIES) return;

  const oldestKey = cache.keys().next().value;
  if (oldestKey) cache.delete(oldestKey);
}

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function execute(): Promise<void> {
    cleanupExpired();

    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      data.value = cached.data as T;
      return;
    }

    try {
      loading.value = true;

      const result = await fetcher();

      cache.set(key, {
        data: result,
        expiry: Date.now() + ttl,
      });

      enforceMaxSize();

      data.value = result;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    error,
    loading,
    execute,
  };
}
