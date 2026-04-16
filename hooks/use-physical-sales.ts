"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./use-auth"
import { SuppliersService, type PhysicalSale } from "@/lib/services/suppliers"

interface UsePhysicalSalesReturn {
  physicalSales: PhysicalSale[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePhysicalSales(): UsePhysicalSalesReturn {
  const { isAuthenticated } = useAuth()
  const [physicalSales, setPhysicalSales] = useState<PhysicalSale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhysicalSales = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const sales = await SuppliersService.getPhysicalSales()
      setPhysicalSales(sales)
    } catch (err) {
      console.error("[usePhysicalSales] Error fetching physical sales:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar histórico de conexão premiada")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhysicalSales()
  }, [isAuthenticated])

  return {
    physicalSales,
    loading,
    error,
    refetch: fetchPhysicalSales,
  }
}
