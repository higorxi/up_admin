import { ApiService } from "./api"

export type SupplierStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface Supplier {
  id: string
  tradeName: string
  companyName: string
  document: string
  stateRegistration: string
  contact: string
  status: SupplierStatus
  storeId: string | null
  store: {
    id: string
    name: string
    description: string
    website: string
    rating: number
    openingHours: string
    addressId: string
    partnerId: string
    address: {
      id: string
      state: string
      city: string
      district: string
      street: string
      complement: string | null
      number: string | null
      zipCode: string
    }
  } | null
}

export class SuppliersService {
  static async getAll(): Promise<Supplier[]> {
    return ApiService.get<Supplier[]>("/partner-suppliers")
  }

  static async getById(id: string): Promise<Supplier> {
    return ApiService.get<Supplier>(`/partner-suppliers/${id}`)
  }

  static async approve(id: string): Promise<void> {
    return ApiService.patch(`/admin/approve-partner/${id}`, {})
  }

  static async reject(id: string, reason: string): Promise<void> {
    return ApiService.patch(`/admin/reject-partner/${id}`, { reason })
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/partner-suppliers/${id}`)
  }

  // static async getStats() - removido
}
