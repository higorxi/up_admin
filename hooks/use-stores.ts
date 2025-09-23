"use client"

import { useState, useEffect } from "react"
import { EventsService, type Store } from "@/lib/services/events"
import { useAuth } from "./use-auth"

interface UseStoresReturn {
  stores: Store[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useStores(): UseStoresReturn {
  const { isAuthenticated } = useAuth()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const storesData = await EventsService.getStores()
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