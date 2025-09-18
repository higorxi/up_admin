import { ApiService } from "./api"

export interface Benefit {
  id: string
  title: string
  description: string
  category: string
  pointsCost: number
  stock: number
  usedStock: number
  status: "active" | "inactive"
  image: string
  validUntil: string
  createdAt: string
}

export interface BenefitRedemption {
  id: string
  benefitId: string
  benefitTitle: string
  userId: string
  userName: string
  userEmail: string
  pointsUsed: number
  status: "pending" | "approved" | "used" | "cancelled"
  redeemedAt: string
  usedAt?: string
}

export class BenefitsService {
  static async getAll(): Promise<Benefit[]> {
    return ApiService.get<Benefit[]>("/benefits")
  }

  static async getById(id: string): Promise<Benefit> {
    return ApiService.get<Benefit>(`/benefits/${id}`)
  }

  static async create(data: Omit<Benefit, "id" | "createdAt" | "usedStock">): Promise<Benefit> {
    return ApiService.post<Benefit>("/benefits", data)
  }

  static async update(id: string, data: Partial<Benefit>): Promise<Benefit> {
    return ApiService.put<Benefit>(`/benefits/${id}`, data)
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/benefits/${id}`)
  }

  static async getRedemptions(): Promise<BenefitRedemption[]> {
    return ApiService.get<BenefitRedemption[]>("/benefits/redemptions")
  }

  static async approveRedemption(redemptionId: string): Promise<void> {
    return ApiService.put(`/benefits/redemptions/${redemptionId}/approve`, {})
  }

  static async markAsUsed(redemptionId: string): Promise<void> {
    return ApiService.put(`/benefits/redemptions/${redemptionId}/used`, {})
  }

  static async cancelRedemption(redemptionId: string): Promise<void> {
    return ApiService.put(`/benefits/redemptions/${redemptionId}/cancel`, {})
  }

  static async getStats(): Promise<{
    total: number
    active: number
    inactive: number
    totalRedemptions: number
    pendingRedemptions: number
  }> {
    return ApiService.get("/benefits/stats")
  }
}
