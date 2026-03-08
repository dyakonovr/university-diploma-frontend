type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();
const DEFAULT_TTL = 1000 * 60 * 5; // 5 min
const MAX_ENTRIES = 100;

/**
 * Императивный кэш для запросов в flow-конструкторе.
 *
 * - TTL: 5 минут
 * - Дедупликация in-flight запросов: параллельные вызовы с одним ключом
 *   ожидают один и тот же Promise (не создают дублирующих HTTP-запросов)
 * - Не использует Vue-реактивность (ref), т.к. работает императивно
 *
 * @example
 * const result = await cachedFetch({
 *   entity: 'models',
 *   params: 'page=1&name=foo',
 *   request: () => getModels(params, signal),
 * });
 */
export async function cachedFetch<T>(options: {
  entity: 'models' | 'providers' | 'artifacts';
  params?: string;
  request: () => Promise<T>;
}): Promise<T> {
  const cacheKey = `${options.entity}::${options.params ?? ''}`;

  // 1. Проверяем кэш
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data as T;
  }

  // 2. Дедупликация: если запрос уже выполняется — ждём его результат
  const existing = inFlight.get(cacheKey);
  if (existing) {
    return existing as Promise<T>;
  }

  // 3. Выполняем запрос и кэшируем
  const promise = options
    .request()
    .then((result) => {
      // Очищаем устаревшие записи при каждом новом добавлении
      const now = Date.now();
      for (const [key, entry] of cache.entries()) {
        if (entry.expiry <= now) cache.delete(key);
      }

      // FIFO-вытеснение при превышении лимита
      if (cache.size >= MAX_ENTRIES) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) cache.delete(oldestKey);
      }

      cache.set(cacheKey, { data: result, expiry: now + DEFAULT_TTL });
      inFlight.delete(cacheKey);
      return result;
    })
    .catch((err) => {
      inFlight.delete(cacheKey);
      throw err;
    });

  inFlight.set(cacheKey, promise);
  return promise;
}

/** Очищает весь кэш (например, при смене flow). */
export function clearCachedFetchCache(): void {
  cache.clear();
  inFlight.clear();
}
