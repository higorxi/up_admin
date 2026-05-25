const resourceCache = new Map<string, unknown>()

export function getCachedResource<T>(key: string): T | null {
  return (resourceCache.get(key) as T | undefined) ?? null
}

export function setCachedResource<T>(key: string, value: T) {
  resourceCache.set(key, value)
}

export function updateCachedResource<T>(key: string, updater: (previous: T | null) => T) {
  const nextValue = updater(getCachedResource<T>(key))
  setCachedResource(key, nextValue)
  return nextValue
}
