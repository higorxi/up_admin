"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { RecommendedProfessional, CreateRecommendedProfessionalDto, UpdateRecommendedProfessionalDto, RecommendedProfessionalsService } from "@/lib/services/recommended-professional"

interface UseRecommendedProfessionalsReturn {
  professionals: RecommendedProfessional[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: CreateRecommendedProfessionalDto) => Promise<void>
  update: (id: string, data: UpdateRecommendedProfessionalDto) => Promise<void>
  toggleStatus: (id: string) => Promise<void>
  delete: (id: string) => Promise<void>
}

export function useRecommendedProfessionals(): UseRecommendedProfessionalsReturn {
  const { isAuthenticated } = useAuth()
  const [professionals, setProfessionals] = useState<RecommendedProfessional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const professionalsData = await RecommendedProfessionalsService.getAll()
      setProfessionals(professionalsData)
    } catch (err) {
      console.error("Error fetching recommended professionals:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar profissionais")
    } finally {
      setLoading(false)
    }
  }

  const create = async (data: CreateRecommendedProfessionalDto) => {
    try {
      const newProfessional = await RecommendedProfessionalsService.create(data)
      setProfessionals((prev) => [...prev, newProfessional])
    } catch (err) {
      console.error("Error creating professional:", err)
      throw err
    }
  }

  const update = async (id: string, data: UpdateRecommendedProfessionalDto) => {
    try {
      const updatedProfessional = await RecommendedProfessionalsService.update(id, data)
      setProfessionals((prev) => prev.map((prof) => (prof.id === id ? updatedProfessional : prof)))
    } catch (err) {
      console.error("Error updating professional:", err)
      throw err
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      const updatedProfessional = await RecommendedProfessionalsService.toggleStatus(id)
      setProfessionals((prev) => prev.map((prof) => (prof.id === id ? updatedProfessional : prof)))
    } catch (err) {
      console.error("Error toggling professional status:", err)
      throw err
    }
  }

  const deleteProfessional = async (id: string) => {
    try {
      await RecommendedProfessionalsService.delete(id)
      setProfessionals((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting professional:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchProfessionals()
  }, [isAuthenticated])

  return {
    professionals,
    loading,
    error,
    refetch: fetchProfessionals,
    create,
    update,
    toggleStatus,
    delete: deleteProfessional,
  }
}