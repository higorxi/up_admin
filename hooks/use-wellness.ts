"use client"

import { useState, useEffect } from "react"
import { WellnessService, type Wellness } from "@/lib/services/wellness"
import { useAuth } from "./use-auth"

interface UseWellnessReturn {
  wellnessList: Wellness[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  approve: (id: string) => Promise<void>
  reject: (id: string, reason: string) => Promise<void>
  deleteWellness: (id: string) => Promise<void>
}

export function useWellness(): UseWellnessReturn {
  const { isAuthenticated } = useAuth()
  const [wellnessList, setWellnessList] = useState<Wellness[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWellness = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(wellnessList.length === 0)
      setError(null)
      const data = await WellnessService.getAll()
      setWellnessList(data)
    } catch (err) {
      console.error("Error fetching wellness partners:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar parceiros wellness")
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id: string) => {
    await WellnessService.approve(id)
    setWellnessList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "APPROVED" as const } : w)),
    )
  }

  const reject = async (id: string, reason: string) => {
    await WellnessService.reject(id, reason)
    setWellnessList((prev) => prev.filter((w) => w.id !== id))
  }

  const deleteWellness = async (id: string) => {
    await WellnessService.delete(id)
    setWellnessList((prev) => prev.filter((w) => w.id !== id))
  }

  useEffect(() => {
    fetchWellness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return {
    wellnessList,
    loading,
    error,
    refetch: fetchWellness,
    approve,
    reject,
    deleteWellness,
  }
}
