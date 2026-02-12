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
  createdAt: string
  updatedAt: string
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
  user: {
    email: string
    profileImage: string
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
  }
}

export class SuppliersService {
  static async getAll(): Promise<Supplier[]> {
    return ApiService.get<Supplier[]>("/partner-suppliers")
  }

  static async getById(id: string): Promise<Supplier> {
    return ApiService.get<Supplier>(`/partner-suppliers/${id}`)
  }

  static async approve(id: string): Promise<void> {
    return ApiService.patch(`/approve-partner/${id}`, {})
  }

  static async reject(id: string, reason: string): Promise<void> {
    return ApiService.patch(`/reject-partner/${id}`, { reason })
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/partner-suppliers/${id}`)
  }
}
