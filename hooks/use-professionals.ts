"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  ProfessionalsService,
  CRMProfessional,
  GetProfessionalsParams,
  ProfessionalsResponse,
  Profession,
  UpdateCRMProfessionalPayload
} from "@/lib/services/professionals"
import { useAuth } from "./use-auth"

interface UseProfessionalsReturn {
  professionals: CRMProfessional[]
  professions: Profession[]
  meta: ProfessionalsResponse["meta"] | null
  loading: boolean
  error: string | null
  refetch: (params?: GetProfessionalsParams) => Promise<void>
  fetchProfessions: () => Promise<void>
  update: (id: string, payload: UpdateCRMProfessionalPayload) => Promise<void>
  toggleVerification: (id: string) => Promise<void>
  deleteProfessional: (id: string) => Promise<void>
}

export function useProfessionals(params: GetProfessionalsParams = {}): UseProfessionalsReturn {
  const { isAuthenticated } = useAuth()
  const [professionals, setProfessionals] = useState<CRMProfessional[]>([])
  const [professions, setProfessions] = useState<Profession[]>([])
  const [meta, setMeta] = useState<ProfessionalsResponse["meta"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const lastParamsRef = useRef<string>("")

  const fetchProfessionals = useCallback(async (fetchParams: GetProfessionalsParams = params) => {
    if (!isAuthenticated) return

    const paramsKey = JSON.stringify(fetchParams)

    try {
      setLoading(true)
      setError(null)

      const response = await ProfessionalsService.getAll(fetchParams)
      setProfessionals(response.data)
      setMeta(response.meta)
      lastParamsRef.current = paramsKey
    } catch (err) {
      console.error("[v0] Error fetching professionals:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar profissionais")
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, params])

  const fetchProfessions = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const professionsData = await ProfessionalsService.getProfessions()
      setProfessions(professionsData)
    } catch (err) {
      console.error("[v0] Error fetching professions:", err)
    }
  }, [isAuthenticated])

  const update = async (id: string, payload: UpdateCRMProfessionalPayload) => {
    const updatedProfessional = await ProfessionalsService.update(id, payload)
    setProfessionals((prev) =>
      prev.map((professional) => (professional.id === id ? updatedProfessional : professional)),
    )
  }

  const toggleVerification = async (id: string) => {
    const updatedProfessional = await ProfessionalsService.toggleVerification(id)
    setProfessionals((prev) =>
      prev.map((professional) => (professional.id === id ? updatedProfessional : professional)),
    )
  }

  const deleteProfessional = async (id: string) => {
    await ProfessionalsService.delete(id)
    setProfessionals((prev) => prev.filter((professional) => professional.id !== id))
    setMeta((prev) =>
      prev
        ? {
            ...prev,
            total: Math.max(prev.total - 1, 0),
          }
        : prev,
    )
  }

  useEffect(() => {
    if (isAuthenticated) {
      const paramsKey = JSON.stringify(params)
      if (paramsKey !== lastParamsRef.current) {
        fetchProfessionals(params)
      }
    }
  }, [isAuthenticated, params, fetchProfessionals])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfessions()
    }
  }, [isAuthenticated, fetchProfessions])

  return {
    professionals,
    professions,
    meta,
    loading,
    error,
    refetch: fetchProfessionals,
    fetchProfessions,
    update,
    toggleVerification,
    deleteProfessional,
  }
}
