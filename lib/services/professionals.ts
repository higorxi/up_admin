import { ApiService } from "./api"

export interface Professional {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  location: string
  rating: number
  status: "active" | "inactive"
  bio: string
  avatar: string
  createdAt: string
}

export class ProfessionalsService {
  static async getAll(): Promise<Professional[]> {
    return ApiService.get<Professional[]>("/professionals")
  }

  static async getById(id: string): Promise<Professional> {
    return ApiService.get<Professional>(`/professionals/${id}`)
  }

  static async create(data: Omit<Professional, "id" | "createdAt">): Promise<Professional> {
    return ApiService.post<Professional>("/professionals", data)
  }

  static async update(id: string, data: Partial<Professional>): Promise<Professional> {
    return ApiService.put<Professional>(`/professionals/${id}`, data)
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/professionals/${id}`)
  }

  static async getStats(): Promise<{
    total: number
    active: number
    inactive: number
    averageRating: number
  }> {
    return ApiService.get("/professionals/stats")
  }
}
