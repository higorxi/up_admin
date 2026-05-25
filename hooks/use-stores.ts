"use client"

import { useState, useEffect } from "react"
import { EventsService, type Store } from "@/lib/services/events"
import { useAuth } from "./use-auth"
import { getCachedResource, setCachedResource } from "@/lib/admin-resource-cache"

const STORES_CACHE_KEY = "admin:stores"

interface UseStoresReturn {
  stores: Store[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useStores(): UseStoresReturn {
  const { isAuthenticated } = useAuth()
  const cachedStores = getCachedResource<Store[]>(STORES_CACHE_KEY)
  const [stores, setStores] = useState<Store[]>(cachedStores ?? [])
  const [loading, setLoading] = useState(!cachedStores)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(stores.length === 0)
      setError(null)

      const storesData = await EventsService.getStores()
      setCachedResource(STORES_CACHE_KEY, storesData)
      setStores(storesData)
    } catch (err) {
      console.error("[useStores] Error fetching stores:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar lojas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [isAuthenticated])

  return {
    stores,
    loading,
    error,
    refetch: fetchStores,
  }
}
