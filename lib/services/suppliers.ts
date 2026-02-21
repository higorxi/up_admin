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
  status?: SubscriptionStatus | string | null
  planType?: PlanType | string | null
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
  stateRegistration: string
  contact: string
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
  store: {
    id: string
    name: string
    description: string
    website: string | null
    rating: number
    openingHours: string
    phone?: string | null
    email?: string | null
    addressId: string
    partnerId: string
    productsCount?: number
    eventsCount?: number
    totalProducts?: number
    totalEvents?: number
    subscription?: SupplierSubscription | null
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

  static async grantTrial(id: string, payload: GrantTrialPayload): Promise<void> {
    return ApiService.patch(`/grant-trial/${id}`, payload)
  }

  static async cancelTrial(id: string): Promise<void> {
    return ApiService.patch(`/cancel-trial/${id}`, {})
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/partner-suppliers/${id}`)
  }
}

const normalizeSubscriptionStatus = (status: string | null | undefined) => status?.toUpperCase().trim() ?? null

const getSupplierSubscription = (supplier: Supplier): SupplierSubscription | null =>
  supplier.subscription ?? supplier.store?.subscription ?? null

export const getSupplierSubscriptionStatus = (supplier: Supplier): string | null => {
  return normalizeSubscriptionStatus(supplier.subscriptionStatus ?? getSupplierSubscription(supplier)?.status)
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

  const subscription = getSupplierSubscription(supplier)
  const isManualTrial = supplier.isManual ?? subscription?.isManual
  if (typeof isManualTrial === "boolean") {
    return isManualTrial
  }

  return getSupplierSubscriptionStatus(supplier) === "TRIALING"
}

export const getSupplierHasActivePlan = (supplier: Supplier): boolean => {
  if (typeof supplier.hasActivePlan === "boolean") {
    return supplier.hasActivePlan
  }

  return getSupplierSubscriptionStatus(supplier) === "ACTIVE" && !getSupplierHasTrial(supplier)
}

export const canSupplierReceiveTrial = (supplier: Supplier): boolean => {
  return !getSupplierHasActivePlan(supplier) && !getSupplierHasTrial(supplier)
}
