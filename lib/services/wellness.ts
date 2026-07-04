import { ApiService } from "./api"

export type WellnessStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface WellnessOffering {
  id: string
  name: string
  description?: string | null
  price?: number | null // null = "sob consulta"
  duration?: string | null
  photoUrl?: string | null
}

export interface Wellness {
  id: string
  name: string
  document: string // CPF
  contact?: string | null
  description?: string | null
  whatsappMessage?: string | null
  status: WellnessStatus
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  services: WellnessOffering[]
  user?: {
    id: string
    email: string
    profileImage?: string | null
    createdAt?: string
    address?: {
      state?: string
      city?: string
      district?: string
      street?: string | null
      number?: string | null
      zipCode?: string | null
    } | null
  } | null
}

export interface UpdateWellnessPayload {
  name?: string
  document?: string
  contact?: string
  description?: string
  whatsappMessage?: string
}

export class WellnessService {
  static async getAll(): Promise<Wellness[]> {
    return ApiService.get<Wellness[]>("/wellness")
  }

  static async update(id: string, payload: UpdateWellnessPayload): Promise<Wellness> {
    return ApiService.patch<Wellness>(`/wellness/${id}`, payload)
  }

  static async approve(id: string): Promise<void> {
    return ApiService.patch(`/wellness/${id}/approve`, {})
  }

  static async reject(id: string, reason: string): Promise<void> {
    return ApiService.patch(`/wellness/${id}/reject`, { reason })
  }

  static async delete(id: string): Promise<void> {
    await ApiService.delete(`/wellness/${id}`)
  }
}
