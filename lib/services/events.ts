import { ApiService } from "./api"

export interface Event {
  id: string
  name: string
  description: string
  date: string
  type: string
  points: number
  totalSpots: number
  filledSpots: number
  isActive: boolean
  storeId: string
  addressId: string
  address?: {
    id: string
    street: string
    district: string
    city: string
    state: string
    zipCode: string
    number: string
    complement?: string
  }
  store?: {
    id: string
    name: string
  }
  participants?: EventRegistration[]
}

export interface EventRegistration {
  id: string
  professionalId: string
  eventId: string
  registeredAt: string
  checkedIn: boolean
  checkedInAt?: string
  professional?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface CreateEventData {
  name: string
  description: string
  date: string // ISO string format: "2025-10-03T14:30:00.000Z"
  type: string
  points: number
  totalSpots: number
  storeId: string
  address?: {
    street: string
    district: string
    city: string
    state: string
    zipCode: string
    number: string
    complement?: string
  }
}

export interface Store {
  id: string
  name: string
}

export class EventsService {
  static async getAll(): Promise<Event[]> {
    return ApiService.get<Event[]>("/events")
  }

  static async getStores(): Promise<Store[]> {
    return ApiService.get<Store[]>("/stores")
  }

  static async create(data: CreateEventData): Promise<Event> {
    return ApiService.post<Event>("/events", data)
  }

  static async update(id: string, data: Partial<CreateEventData>): Promise<Event> {
    return ApiService.patch<Event>(`/events/${id}`, data)
  }

  static async toggleEvent(eventId: string): Promise<Event> {
    return ApiService.patch<Event>(`/events/${eventId}/toggle`, {})
  }

  static async checkInAttendee(eventId: string, professionalId: string): Promise<EventRegistration> {
    return ApiService.post<EventRegistration>(`/events/${eventId}/checkin/${professionalId}`, {})
  }

  static async getEventParticipants(eventId: string): Promise<EventRegistration[]> {
    return ApiService.get<EventRegistration[]>(`/events/${eventId}/participants`)
  }
}