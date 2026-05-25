"use client"

import { useState, useEffect } from "react"
import { 
  BenefitsService, 
  type Benefit, 
  type BenefitRedemption,
  type CreateBenefitData,
  type UpdateBenefitData,
  type BenefitsStatistics
} from "@/lib/services/benefits"
import { useAuth } from "./use-auth"
import { getCachedResource, setCachedResource, updateCachedResource } from "@/lib/admin-resource-cache"

const BENEFITS_CACHE_KEY = "admin:benefits"

interface UseBenefitsReturn {
  benefits: Benefit[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: CreateBenefitData) => Promise<Benefit>
  update: (id: string, data: UpdateBenefitData) => Promise<Benefit>
  deleteBenefit: (id: string) => Promise<{ message: string; softDeleted: boolean }>
  toggleStatus: (id: string) => Promise<Benefit>
  getRedemptions: (params?: { 
    status?: "PENDING" | "USED" | "CANCELED" | "EXPIRED"
    benefitId?: string
    professionalId?: string
  }) => Promise<BenefitRedemption[]>
  getRedemptionById: (id: string) => Promise<BenefitRedemption>
  updateRedemptionStatus: (
    redemptionId: string, 
    status: "PENDING" | "USED" | "CANCELED" | "EXPIRED"
  ) => Promise<BenefitRedemption>
  getStatistics: () => Promise<BenefitsStatistics>
}

export function useBenefits(): UseBenefitsReturn {
  const { isAuthenticated } = useAuth()
  const cachedBenefits = getCachedResource<Benefit[]>(BENEFITS_CACHE_KEY)
  const [benefits, setBenefits] = useState<Benefit[]>(cachedBenefits ?? [])
  const [loading, setLoading] = useState(!cachedBenefits)
  const [error, setError] = useState<string | null>(null)

  const fetchBenefits = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      setLoading(benefits.length === 0)
      setError(null)

      const benefitsData = await BenefitsService.getAll()
      setCachedResource(BENEFITS_CACHE_KEY, benefitsData)
      setBenefits(benefitsData)
    } catch (err) {
      console.error("[useBenefits] Error fetching benefits:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar benefícios")
    } finally {
      setLoading(false)
    }
  }

  const create = async (data: CreateBenefitData): Promise<Benefit> => {
    try {
      const newBenefit = await BenefitsService.create(data)
      setBenefits((prev) => updateCachedResource<Benefit[]>(BENEFITS_CACHE_KEY, () => [newBenefit, ...prev]))
      return newBenefit
    } catch (err) {
      console.error("[useBenefits] Error creating benefit:", err)
      throw err
    }
  }

  const update = async (id: string, data: UpdateBenefitData): Promise<Benefit> => {
    try {
      const updatedBenefit = await BenefitsService.update(id, data)
      setBenefits((prev) => 
        updateCachedResource<Benefit[]>(BENEFITS_CACHE_KEY, () =>
          prev.map((benefit) => (benefit.id === id ? updatedBenefit : benefit)),
        )
      )
      return updatedBenefit
    } catch (err) {
      console.error("[useBenefits] Error updating benefit:", err)
      throw err
    }
  }

  const deleteBenefit = async (id: string): Promise<{ message: string; softDeleted: boolean }> => {
    try {
      const result = await BenefitsService.delete(id)
      
      if (result.softDeleted) {
        // Soft delete: atualiza o status para inativo
        setBenefits((prev) =>
          updateCachedResource<Benefit[]>(BENEFITS_CACHE_KEY, () =>
            prev.map((benefit) => 
              benefit.id === id ? { ...benefit, isActive: false } : benefit
            ),
          )
        )
      } else {
        // Hard delete: remove da lista
        setBenefits((prev) => updateCachedResource<Benefit[]>(BENEFITS_CACHE_KEY, () => prev.filter((b) => b.id !== id)))
      }
      
      return result
    } catch (err) {
      console.error("[useBenefits] Error deleting benefit:", err)
      throw err
    }
  }

  const toggleStatus = async (id: string): Promise<Benefit> => {
    try {
      const updatedBenefit = await BenefitsService.toggleStatus(id)
      setBenefits((prev) =>
        updateCachedResource<Benefit[]>(BENEFITS_CACHE_KEY, () =>
          prev.map((benefit) => (benefit.id === id ? updatedBenefit : benefit)),
        )
      )
      return updatedBenefit
    } catch (err) {
      console.error("[useBenefits] Error toggling benefit status:", err)
      throw err
    }
  }

  const getRedemptions = async (params?: {
    status?: "PENDING" | "USED" | "CANCELED" | "EXPIRED"
    benefitId?: string
    professionalId?: string
  }): Promise<BenefitRedemption[]> => {
    try {
      return await BenefitsService.getAllRedemptions(params)
    } catch (err) {
      console.error("[useBenefits] Error fetching redemptions:", err)
      throw err
    }
  }

  const getRedemptionById = async (id: string): Promise<BenefitRedemption> => {
    try {
      return await BenefitsService.getRedemptionById(id)
    } catch (err) {
      console.error("[useBenefits] Error fetching redemption:", err)
      throw err
    }
  }

  const updateRedemptionStatus = async (
    redemptionId: string, 
    status: "PENDING" | "USED" | "CANCELED" | "EXPIRED"
  ): Promise<BenefitRedemption> => {
    try {
      const updatedRedemption = await BenefitsService.updateRedemptionStatus(redemptionId, status)
      // Refetch benefits para atualizar estatísticas
      await fetchBenefits()
      return updatedRedemption
    } catch (err) {
      console.error("[useBenefits] Error updating redemption status:", err)
      throw err
    }
  }

  const getStatistics = async (): Promise<BenefitsStatistics> => {
    try {
      return await BenefitsService.getStatistics()
    } catch (err) {
      console.error("[useBenefits] Error fetching statistics:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchBenefits()
  }, [isAuthenticated])

  return {
    benefits,
    loading,
    error,
    refetch: fetchBenefits,
    create,
    update,
    deleteBenefit,
    toggleStatus,
    getRedemptions,
    getRedemptionById,
    updateRedemptionStatus,
    getStatistics,
  }
}
