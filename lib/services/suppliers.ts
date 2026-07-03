import { ApiService } from "./api"

export type SupplierStatus = "PENDING" | "APPROVED" | "REJECTED"
export type TrialDurationUnit = "days" | "weeks" | "months"
export type PlanType = "SILVER" | "GOLD" | "PREMIUM"
export type SubscriptionStatus = "ACTIVE" | "TRIALING" | "CANCELED" | "INACTIVE" | "PAST_DUE" | "UNPAID" | "EXPIRED"

export interface GrantTrialPayload {
  duration: number
  unit: TrialDurationUnit
  planType: PlanType
}

export interface SupplierSubscription {
  id?: string
  partnerSupplierId?: string
  stripeCustomerId?: string | null
  subscriptionId?: string | null
  status?: SubscriptionStatus | string | null
  subscriptionStatus?: SubscriptionStatus | string | null
  planType?: PlanType | string | null
  cancelAtPeriodEnd?: boolean | null
  isManual?: boolean | null
  trialEndsAt?: string | null
  currentPeriodEnd?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Supplier {
  id: string
  tradeName: string
  companyName: string
  document: string
  documentType?: "CPF" | "CNPJ"
  stateRegistration: string
  contact: string
  type?: "SUPPLIER" | "WELLNESS"
  status: SupplierStatus
  storeId: string | null
  createdAt: string
  updatedAt: string
  subscription?: SupplierSubscription | null
  subscriptionStatus?: SubscriptionStatus | string | null
  hasActivePlan?: boolean | null
  hasTrial?: boolean | null
  isManual?: boolean | null
  trialEndsAt?: string | null
  trialEndDate?: string | null
  trialDuration?: number | null
  trialDurationUnit?: TrialDurationUnit | string | null
  pointsLimit?: number | null
  currentPointsAwarded?: number | null
  store: {
    id: string
    name: string
    description: string
    website: string | null
    rating: number
    openingHours: string
    logoUrl?: string | null
    phone?: string | null
    email?: string | null
    addressId: string
    partnerId: string
    productsCount?: number
    eventsCount?: number
    totalProducts?: number
    totalEvents?: number
    subscription?: SupplierSubscription | null
    _count?: {
      products?: number
      events?: number
    } | null
    address: {
      id: string
      state: string
      city: string
      district: string
      neighborhood?: string | null
      street: string
      complement: string | null
      number: string | null
      zipCode: string
    }
    products?: SupplierProduct[]
    events?: Array<{
      id: string
      name: string
      date: string
      isActive: boolean
      totalSpots: number
      filledSpots: number
    }>
  } | null
  user?: {
    email: string
    profileImage: string | null
    address?: {
      id: string
      state: string
      city: string
      district: string
      street: string
      complement: string | null
      number: string | null
      zipCode: string
    } | null
  } | null
}

export interface UpdateSupplierPayload {
  tradeName?: string
  companyName?: string
  document?: string
  stateRegistration?: string
  contact?: string
  type?: "SUPPLIER" | "WELLNESS"
}

export interface SupplierAddressPayload {
  state: string
  city: string
  district: string
  street?: string
  complement?: string
  number?: string
  zipCode?: string
}

export interface SupplierStorePayload {
  name: string
  description?: string
  website?: string
  openingHours?: string
  logoUrl?: string
  partnerId?: string
  address?: SupplierAddressPayload
}

export interface SupplierProduct {
  id: string
  name: string
  description?: string | null
  price: number
  link?: string | null
  featured: boolean
  promotion: boolean
  photoUrl?: string | null
  duration?: string | null
  storeId: string
  createdAt?: string
  updatedAt?: string
}

export interface SupplierProductPayload {
  name: string
  description?: string
  price: number
  link?: string
  featured?: boolean
  promotion?: boolean
  photoUrl?: string
  duration?: string
}

export interface PhysicalSale {
  id: string
  code?: string | null
  pointsCode?: string | null
  customerName?: string | null
  clientName?: string | null
  saleValue?: number | null
  amount?: number | null
  value?: number | null
  points?: number | null
  pointsAwarded?: number | null
  isRedeemed?: boolean | null
  status?: string | null
  redeemedAt?: string | null
  createdAt: string
  partnerSupplier?: {
    id: string
    tradeName?: string | null
    companyName?: string | null
  } | null
  partner?: {
    id: string
    tradeName?: string | null
    companyName?: string | null
    name?: string | null
  } | null
  professional?: {
    id: string
    email?: string | null
    user?: {
      email?: string | null
    } | null 
  } | null
  redeemedProfessional?: {
    id: string
    email?: string | null
  } | null
  professionalEmail?: string | null
}

export class SuppliersService {
  static async getAll(): Promise<Supplier[]> {
    return ApiService.get<Supplier[]>("/partner-suppliers")
  }

  static async getById(id: string): Promise<Supplier> {
    return ApiService.get<Supplier>(`/partner-suppliers/${id}`)
  }

  static async update(id: string, payload: UpdateSupplierPayload): Promise<Supplier> {
    return ApiService.patch<Supplier>(`/partner-suppliers/${id}`, payload)
  }

  static async createStore(payload: SupplierStorePayload): Promise<Supplier["store"]> {
    return ApiService.post<Supplier["store"]>("/stores", payload)
  }

  static async updateStore(id: string, payload: SupplierStorePayload): Promise<Supplier["store"]> {
    return ApiService.patch<Supplier["store"]>(`/stores/${id}`, payload)
  }

  static async createProduct(storeId: string, payload: SupplierProductPayload): Promise<SupplierProduct> {
    return ApiService.post<SupplierProduct>(`/stores/${storeId}/products`, payload)
  }

  static async updateProduct(id: string, payload: SupplierProductPayload): Promise<SupplierProduct> {
    return ApiService.patch<SupplierProduct>(`/products/${id}`, payload)
  }

  static async deleteProduct(id: string): Promise<void> {
    return ApiService.delete<void>(`/products/${id}`)
  }

  static async approve(id: string): Promise<void> {
    return ApiService.patch(`/approve-partner/${id}`, {})
  }

  static async reject(id: string, reason: string): Promise<void> {
    return ApiService.patch(`/reject-partner/${id}`, { reason })
  }

  static async grantTrial(id: string, payload: GrantTrialPayload): Promise<void> {
    return ApiService.patch(`/grant-trial/${id}`, payload)
  }

  static async cancelTrial(id: string): Promise<void> {
    return ApiService.patch(`/cancel-trial/${id}`, {})
  }

  static async updatePointsLimit(id: string, payload: { pointsLimit: number }): Promise<Supplier> {
    return ApiService.patch<Supplier>(`/partner-suppliers/${id}/points-limit`, payload)
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/partner-supplier/${id}`)
  }

  static async getPhysicalSales(): Promise<PhysicalSale[]> {
    return ApiService.get<PhysicalSale[]>("/physical-sales")
  }
}

const normalizeSubscriptionStatus = (status: string | null | undefined) => status?.toUpperCase().trim() ?? null

const getSupplierSubscription = (supplier: Supplier): SupplierSubscription | null =>
  supplier.subscription ?? supplier.store?.subscription ?? null

const getSupplierIsManual = (supplier: Supplier): boolean | null => {
  const subscription = getSupplierSubscription(supplier)
  const manualValue = supplier.isManual ?? subscription?.isManual

  return typeof manualValue === "boolean" ? manualValue : null
}

export const getSupplierSubscriptionStatus = (supplier: Supplier): string | null => {
  const subscription = getSupplierSubscription(supplier)

  return normalizeSubscriptionStatus(
    supplier.subscriptionStatus ?? subscription?.subscriptionStatus ?? subscription?.status,
  )
}

export const getSupplierPlanType = (supplier: Supplier): PlanType | null => {
  const subscription = getSupplierSubscription(supplier)
  return (subscription?.planType as PlanType) ?? null
}

export const getSupplierTrialEndsAt = (supplier: Supplier): string | null => {
  const subscription = getSupplierSubscription(supplier)

  return (
    supplier.trialEndsAt ??
    supplier.trialEndDate ??
    subscription?.trialEndsAt ??
    (getSupplierHasTrial(supplier) ? subscription?.currentPeriodEnd ?? null : null) ??
    null
  )
}

export const getSupplierHasTrial = (supplier: Supplier): boolean => {
  if (typeof supplier.hasTrial === "boolean") {
    return supplier.hasTrial
  }

  const status = getSupplierSubscriptionStatus(supplier)
  const isManual = getSupplierIsManual(supplier)

  if (isManual) {
    // Trials manuais podem estar marcados como ACTIVE ou TRIALING no back.
    return status === "ACTIVE" || status === "TRIALING"
  }

  return status === "TRIALING"
}

export const getSupplierHasActivePlan = (supplier: Supplier): boolean => {
  if (typeof supplier.hasActivePlan === "boolean") {
    return supplier.hasActivePlan
  }

  const status = getSupplierSubscriptionStatus(supplier)
  if (status !== "ACTIVE") return false

  // ACTIVE manual representa trial em alguns cenários.
  if (getSupplierIsManual(supplier)) return false

  return !getSupplierHasTrial(supplier)
}

export const canSupplierReceiveTrial = (supplier: Supplier): boolean => {
  return !getSupplierHasActivePlan(supplier) && !getSupplierHasTrial(supplier)
}
