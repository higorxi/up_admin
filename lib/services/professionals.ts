import { ApiService } from "./api"

export type ProfessionalLevel = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"

export interface Profession {
  id: string
  name: string
}

export interface ProfessionalSocialMedia {
  instagram?: string
  linkedin?: string
  whatsapp?: string
}

export interface CRMProfessional {
  id: string
  name: string
  email: string
  document: string
  phone: string
  level: ProfessionalLevel
  points: number
  verified: boolean
  createdAt: string
  profession: Profession
  socialMedia?: ProfessionalSocialMedia
  _count: {
    eventRegistrations: number
    workshops: number
    redemptions: number
  }
}

export interface GetProfessionalsParams {
  page?: number
  limit?: number
  search?: string
  level?: ProfessionalLevel
  professionId?: string
  verified?: boolean
  orderBy?: "name" | "createdAt" | "points" | "level"
  order?: "asc" | "desc"
}

export interface ProfessionalsResponse {
  data: CRMProfessional[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export class ProfessionalsService {
  static async getAll(params: GetProfessionalsParams = {}): Promise<ProfessionalsResponse> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append("page", params.page.toString())
    if (params.limit) searchParams.append("limit", params.limit.toString())
    if (params.search) searchParams.append("search", params.search)
    if (params.level) searchParams.append("level", params.level)
    if (params.professionId) searchParams.append("professionId", params.professionId)
    if (params.verified !== undefined) searchParams.append("verified", params.verified.toString())
    if (params.orderBy) searchParams.append("orderBy", params.orderBy)
    if (params.order) searchParams.append("order", params.order)

    const queryString = searchParams.toString()
    const endpoint = `/professionals${queryString ? `?${queryString}` : ""}`

    return ApiService.get<ProfessionalsResponse>(endpoint)
  }

  static async getProfessions(): Promise<Profession[]> {
    return ApiService.get<Profession[]>("/professions")
  }
}
