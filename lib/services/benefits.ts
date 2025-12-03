import { ApiService } from "./api"

export interface Benefit {
  id: string
  name: string
  description?: string
  pointsCost: number
  quantity?: number
  imageUrl?: string
  isActive: boolean
  expiresAt?: string
  createdAt: string
  // Campos computados retornados pelo backend
  activeRedemptions?: number
  _count?: {
    redemptions: number
  }
}

export interface BenefitRedemption {
  id: string
  benefitId: string
  professionalId: string
  status: "PENDING" | "USED" | "CANCELED" | "EXPIRED"
  pointsSpent: number
  redeemedAt: string
  usedAt?: string
  expiresAt?: string
  professional?: {
    id: string
    name: string
    phone: string
    level: string
    points?: number
    user: {
      email: string
    }
  }
  benefit?: {
    id: string
    name: string
    description?: string
    pointsCost: number
    imageUrl?: string
  }
}

export interface CreateBenefitData {
  name: string
  description?: string
  pointsCost: number
  quantity?: number
  imageUrl?: string
  isActive?: boolean
  expiresAt?: Date | string
}

export interface UpdateBenefitData {
  name?: string
  description?: string
  pointsCost?: number
  quantity?: number
  imageUrl?: string
  isActive?: boolean
  expiresAt?: Date | string
}

export interface BenefitsStatistics {
  totalBenefits: number
  activeBenefits: number
  inactiveBenefits: number
  totalRedemptions: number
  pendingRedemptions: number
  usedRedemptions: number
  totalPointsSpent: number
  topBenefits: Array<{
    id: string
    name: string
    redemptionsCount: number
    pointsCost: number
  }>
}

export class BenefitsService {
  // Rotas de benefícios
  static async getAll(): Promise<Benefit[]> {
    return ApiService.get<Benefit[]>("/benefits")
  }

  static async getById(id: string): Promise<Benefit> {
    return ApiService.get<Benefit>(`/benefits/${id}`)
  }

  static async create(data: CreateBenefitData): Promise<Benefit> {
    return ApiService.post<Benefit>("/benefits", data)
  }

  static async update(id: string, data: UpdateBenefitData): Promise<Benefit> {
    return ApiService.put<Benefit>(`/benefits/${id}`, data)
  }

  static async delete(id: string): Promise<{ message: string; softDeleted: boolean }> {
    return ApiService.delete(`/benefits/${id}`)
  }

  static async toggleStatus(id: string): Promise<Benefit> {
    return ApiService.patch<Benefit>(`/benefits/${id}/toggle`)
  }

  // Rotas de redemptions (resgates)
  static async getAllRedemptions(params?: {
    status?: "PENDING" | "USED" | "CANCELED" | "EXPIRED"
    benefitId?: string
    professionalId?: string
  }): Promise<BenefitRedemption[]> {
    const searchParams = new URLSearchParams()
    
    if (params?.status) searchParams.append("status", params.status)
    if (params?.benefitId) searchParams.append("benefitId", params.benefitId)
    if (params?.professionalId) searchParams.append("professionalId", params.professionalId)
    
    const query = searchParams.toString()
    return ApiService.get<BenefitRedemption[]>(
      `/benefits/redemptions/all${query ? `?${query}` : ""}`
    )
  }

  static async getRedemptionById(id: string): Promise<BenefitRedemption> {
    return ApiService.get<BenefitRedemption>(`/benefits/redemptions/${id}`)
  }

  static async updateRedemptionStatus(
    redemptionId: string, 
    status: "PENDING" | "USED" | "CANCELED" | "EXPIRED"
  ): Promise<BenefitRedemption> {
    return ApiService.put<BenefitRedemption>(
      `/benefits/redemptions/${redemptionId}/status`,
      { status }
    )
  }

  // Estatísticas
  static async getStatistics(): Promise<BenefitsStatistics> {
    return ApiService.get<BenefitsStatistics>("/benefits/statistics")
  }

  // Expirar resgates (cron job manual)
  static async expireRedemptions(): Promise<{ expiredCount: number; message: string }> {
    return ApiService.post("/benefits/redemptions/expire", {})
  }
}