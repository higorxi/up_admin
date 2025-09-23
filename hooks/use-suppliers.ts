"use client"

import { useState, useEffect } from "react"
import { SuppliersService, type Supplier } from "@/lib/services/suppliers"
import { useAuth } from "./use-auth"

interface UseSuppliersReturn {
  suppliers: Supplier[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  approve: (id: string) => Promise<void>
  reject: (id: string, reason: string) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>
}

export function useSuppliers(): UseSuppliersReturn {
  const { isAuthenticated } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuppliers = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const suppliersData = await SuppliersService.getAll()
      setSuppliers(suppliersData)
    } catch (err) {
      console.error("[v0] Error fetching suppliers:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar fornecedores")
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id: string) => {
    try {
      await SuppliersService.approve(id)
      setSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === id ? { ...supplier, accessPending: false } : supplier)),
      )
    } catch (err) {
      console.error("[v0] Error approving supplier:", err)
      throw err
    }
  }

  const reject = async (id: string, reason: string) => {
    try {
      await SuppliersService.reject(id, reason)
      setSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === id ? { ...supplier, accessPending: true } : supplier)),
      )
    } catch (err) {
      console.error("[v0] Error rejecting supplier:", err)
      throw err
    }
  }

  const deleteSupplier = async (id: string) => {
    try {
      await SuppliersService.delete(id)
      setSuppliers((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error("[v0] Error deleting supplier:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [isAuthenticated])

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    approve,
    reject,
    deleteSupplier,
  }
}
