import { ApiService } from "./api"

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  company: string
  category: string
  location: string
  registrationDate: string
  status: "pending" | "approved" | "rejected"
  description: string
  experience: string
  portfolio?: string
  documents: string[]
  createdAt: string
}

export class SuppliersService {
  static async getAll(): Promise<Supplier[]> {
    return ApiService.get<Supplier[]>("/suppliers")
  }

  static async getById(id: string): Promise<Supplier> {
    return ApiService.get<Supplier>(`/suppliers/${id}`)
  }

  static async approve(id: string): Promise<void> {
    return ApiService.put(`/suppliers/${id}/approve`, {})
  }

  static async reject(id: string, reason: string): Promise<void> {
    return ApiService.put(`/suppliers/${id}/reject`, { reason })
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/suppliers/${id}`)
  }

  static async getStats(): Promise<{
    total: number
    pending: number
    approved: number
    rejected: number
  }> {
    return ApiService.get("/suppliers/stats")
  }
}
