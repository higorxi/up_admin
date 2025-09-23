"use client"

import { useState, useEffect } from "react"
import { BenefitsService, type Benefit } from "@/lib/services/benefits"
import { useAuth } from "./use-auth"

interface UseBenefitsReturn {
  benefits: Benefit[]
  loading: boolean
  error: string | null
  stats: {
    total: number
    active: number
    inactive: number
    categories: number
  }
  refetch: () => Promise<void>
  create: (data: Omit<Benefit, "id" | "createdAt">) => Promise<void>
  update: (id: string, data: Partial<Benefit>) => Promise<void>
  delete: (id: string) => Promise<void>
  toggleStatus: (id: string) => Promise<void>
}

export function useBenefits(): UseBenefitsReturn {
  const { isAuthenticated } = useAuth()
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    categories: 0,
  })

  const fetchBenefits = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const [benefitsData] = await Promise.all([BenefitsService.getAll()])

      setBenefits(benefitsData)
    } catch (err) {
      console.error("[v0] Error fetching benefits:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar benefícios")
    } finally {
      setLoading(false)
    }
  }

  const create = async (data: Omit<Benefit, "id" | "createdAt">) => {
    try {
      const newBenefit = await BenefitsService.create(data)
      setBenefits((prev) => [...prev, newBenefit])
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        active: data.isActive ? prev.active + 1 : prev.active,
        inactive: !data.isActive ? prev.inactive + 1 : prev.inactive,
      }))
    } catch (err) {
      console.error("[v0] Error creating benefit:", err)
      throw err
    }
  }

  const update = async (id: string, data: Partial<Benefit>) => {
    try {
      const updatedBenefit = await BenefitsService.update(id, data)
      setBenefits((prev) => prev.map((benefit) => (benefit.id === id ? updatedBenefit : benefit)))
    } catch (err) {
      console.error("[v0] Error updating benefit:", err)
      throw err
    }
  }

  const deleteBenefit = async (id: string) => {
    try {
      await BenefitsService.delete(id)
      const benefit = benefits.find((b) => b.id === id)
      setBenefits((prev) => prev.filter((b) => b.id !== id))

      if (benefit) {
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          active: benefit.isActive ? prev.active - 1 : prev.active,
          inactive: !benefit.isActive ? prev.inactive - 1 : prev.inactive,
        }))
      }
    } catch (err) {
      console.error("[v0] Error deleting benefit:", err)
      throw err
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      await BenefitsService.toggleStatus(id)
      setBenefits((prev) =>
        prev.map((benefit) => (benefit.id === id ? { ...benefit, isActive: !benefit.isActive } : benefit)),
      )

      const benefit = benefits.find((b) => b.id === id)
      if (benefit) {
        setStats((prev) => ({
          ...prev,
          active: benefit.isActive ? prev.active - 1 : prev.active + 1,
          inactive: benefit.isActive ? prev.inactive + 1 : prev.inactive - 1,
        }))
      }
    } catch (err) {
      console.error("[v0] Error toggling benefit status:", err)
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
    stats,
    refetch: fetchBenefits,
    create,
    update,
    delete: deleteBenefit,
    toggleStatus,
  }
}
