import { ApiService } from "./api"

export enum WeekDay {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export interface Address {
  id?: string
  state: string
  city: string
  district: string
  street?: string
  complement?: string
  number?: string
  zipCode?: string
}

export interface SocialMedia {
  id?: string
  linkedin?: string
  instagram?: string
  whatsapp?: string
}

export interface AvailableDay {
  id?: string
  dayOfWeek: WeekDay
}

export interface RecommendedProfessional {
  id: string
  name: string
  profession: string
  description: string
  phone: string
  email: string | null
  profileImage: string | null
  isActive: boolean
  address: Address
  socialMedia: SocialMedia | null
  availableDays: AvailableDay[]
  createdAt: string
  updatedAt: string
}

export interface CreateRecommendedProfessionalDto {
  name: string
  profession: string
  description?: string
  phone: string
  email?: string
  profileImage?: string
  isActive?: boolean
  address: Omit<Address, "id">
  socialMedia?: Omit<SocialMedia, "id">
  availableDays?: WeekDay[]
}

export interface UpdateRecommendedProfessionalDto {
  name?: string
  profession?: string
  description?: string
  phone?: string
  email?: string
  profileImage?: string
  isActive?: boolean
  address?: Omit<Address, "id">
  socialMedia?: Omit<SocialMedia, "id">
  availableDays?: WeekDay[]
}

export class RecommendedProfessionalsService {
  static async getAll(): Promise<RecommendedProfessional[]> {
    return ApiService.get<RecommendedProfessional[]>("/recommended-professionals")
  }

  static async getById(id: string): Promise<RecommendedProfessional> {
    return ApiService.get<RecommendedProfessional>(`/recommended-professionals/${id}`)
  }

  static async create(data: CreateRecommendedProfessionalDto): Promise<RecommendedProfessional> {
    return ApiService.post<RecommendedProfessional>("/recommended-professionals", data)
  }

  static async update(id: string, data: UpdateRecommendedProfessionalDto): Promise<RecommendedProfessional> {
    return ApiService.patch<RecommendedProfessional>(`/recommended-professionals/${id}`, data)
  }

  static async toggleStatus(id: string): Promise<RecommendedProfessional> {
    return ApiService.patch<RecommendedProfessional>(`/recommended-professionals/toggle-status/${id}`, {})
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/recommended-professionals/${id}`)
  }
}