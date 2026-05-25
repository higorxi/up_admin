"use client"

import { useState, useEffect } from "react"
import { SuppliersService, type Supplier, type GrantTrialPayload, type UpdateSupplierPayload } from "@/lib/services/suppliers"
import { useAuth } from "./use-auth"
import { getCachedResource, setCachedResource, updateCachedResource } from "@/lib/admin-resource-cache"

const SUPPLIERS_CACHE_KEY = "admin:suppliers"

interface UseSuppliersReturn {
  suppliers: Supplier[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  approve: (id: string) => Promise<void>
  updateSupplier: (id: string, payload: UpdateSupplierPayload) => Promise<void>
  reject: (id: string, reason: string) => Promise<void>
  grantTrial: (id: string, payload: GrantTrialPayload) => Promise<void>
  cancelTrial: (id: string) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>
  updatePointsLimit: (id: string, pointsLimit: number) => Promise<void>
}

export function useSuppliers(): UseSuppliersReturn {
  const { isAuthenticated } = useAuth()
  const cachedSuppliers = getCachedResource<Supplier[]>(SUPPLIERS_CACHE_KEY)
  const [suppliers, setSuppliers] = useState<Supplier[]>(cachedSuppliers ?? [])
  const [loading, setLoading] = useState(!cachedSuppliers)
  const [error, setError] = useState<string | null>(null)

  const fetchSuppliers = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(suppliers.length === 0)
      setError(null)

      const suppliersData = await SuppliersService.getAll()
      setCachedResource(SUPPLIERS_CACHE_KEY, suppliersData)
      setSuppliers(suppliersData)
    } catch (err) {
      console.error("[v0] Error fetching suppliers:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar lojistas parceiros")
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id: string) => {
    try {
      await SuppliersService.approve(id)
      setSuppliers((prev) =>
        updateCachedResource<Supplier[]>(SUPPLIERS_CACHE_KEY, () =>
          prev.map((supplier) => (supplier.id === id ? { ...supplier, status: "APPROVED" } : supplier)),
        ),
      )
    } catch (err) {
      console.error("[v0] Error approving supplier:", err)
      throw err
    }
  }

  const updateSupplier = async (id: string, payload: UpdateSupplierPayload) => {
    try {
      const updatedSupplier = await SuppliersService.update(id, payload)
      setSuppliers((prev) =>
        updateCachedResource<Supplier[]>(SUPPLIERS_CACHE_KEY, () =>
          prev.map((supplier) => (supplier.id === id ? { ...supplier, ...updatedSupplier } : supplier)),
        ),
      )
    } catch (err) {
      console.error("[v0] Error updating supplier:", err)
      throw err
    }
  }

  const reject = async (id: string, reason: string) => {
    try {
      await SuppliersService.reject(id, reason)
      setSuppliers((prev) =>
        updateCachedResource<Supplier[]>(SUPPLIERS_CACHE_KEY, () =>
          prev.map((supplier) => (supplier.id === id ? { ...supplier, status: "REJECTED" } : supplier)),
        ),
      )
    } catch (err) {
      console.error("[v0] Error rejecting supplier:", err)
      throw err
    }
  }

  const grantTrial = async (id: string, payload: GrantTrialPayload) => {
    try {
      await SuppliersService.grantTrial(id, payload)
    } catch (err) {
      console.error("[v0] Error granting trial:", err)
      throw err
    }
  }

  const cancelTrial = async (id: string) => {
    try {
      await SuppliersService.cancelTrial(id)
    } catch (err) {
      console.error("[v0] Error canceling trial:", err)
      throw err
    }
  }

  const deleteSupplier = async (id: string) => {
    try {
      await SuppliersService.delete(id)
      setSuppliers((prev) => updateCachedResource<Supplier[]>(SUPPLIERS_CACHE_KEY, () => prev.filter((s) => s.id !== id)))
    } catch (err) {
      console.error("[v0] Error deleting supplier:", err)
      throw err
    }
  }

  const updatePointsLimit = async (id: string, pointsLimit: number) => {
    try {
      const updatedSupplier = await SuppliersService.updatePointsLimit(id, { pointsLimit })
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === id
            ? {
                ...supplier,
                ...updatedSupplier,
                pointsLimit: updatedSupplier.pointsLimit ?? pointsLimit,
                currentPointsAwarded: updatedSupplier.currentPointsAwarded ?? supplier.currentPointsAwarded,
              }
            : supplier,
        ),
      )
    } catch (err) {
      console.error("[v0] Error updating supplier points limit:", err)
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
    updateSupplier,
    reject,
    grantTrial,
    cancelTrial,
    deleteSupplier,
    updatePointsLimit,
  }
}
