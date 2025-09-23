"use client"

import { useState, useEffect } from "react"
import { ProfessionalsService, type Professional } from "@/lib/services/professionals"
import { useAuth } from "./use-auth"

interface UseProfessionalsReturn {
  professionals: Professional[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (
    data: Omit<Professional, "id" | "createdAt" | "updatedAt" | "address" | "socialMedia" | "availableDays">,
  ) => Promise<void>
  update: (id: string, data: Partial<Professional>) => Promise<void>
  delete: (id: string) => Promise<void>
}

export function useProfessionals(): UseProfessionalsReturn {
  const { isAuthenticated } = useAuth()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const professionalsData = await ProfessionalsService.getAll()
      setProfessionals(professionalsData)
    } catch (err) {
      console.error("[v0] Error fetching professionals:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar profissionais")
    } finally {
      setLoading(false)
    }
  }

  const create = async (
    data: Omit<Professional, "id" | "createdAt" | "updatedAt" | "address" | "socialMedia" | "availableDays">,
  ) => {
    try {
      const newProfessional = await ProfessionalsService.create(data)
      setProfessionals((prev) => [...prev, newProfessional])
    } catch (err) {
      console.error("[v0] Error creating professional:", err)
      throw err
    }
  }

  const update = async (id: string, data: Partial<Professional>) => {
    try {
      const updatedProfessional = await ProfessionalsService.update(id, data)
      setProfessionals((prev) => prev.map((prof) => (prof.id === id ? updatedProfessional : prof)))
    } catch (err) {
      console.error("[v0] Error updating professional:", err)
      throw err
    }
  }

  const deleteProfessional = async (id: string) => {
    try {
      await ProfessionalsService.delete(id)
      setProfessionals((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("[v0] Error deleting professional:", err)
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
    delete: deleteProfessional,
  }
}
