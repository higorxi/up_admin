import { ApiService } from "./api"

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxAttendees: number
  currentAttendees: number
  status: "draft" | "published" | "cancelled"
  image: string
  createdAt: string
}

export interface EventAttendee {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar: string
  registeredAt: string
  checkedIn: boolean
  checkedInAt?: string
}

export class EventsService {
  static async getAll(): Promise<Event[]> {
    return ApiService.get<Event[]>("/events")
  }

  static async getById(id: string): Promise<Event> {
    return ApiService.get<Event>(`/events/${id}`)
  }

  static async create(data: Omit<Event, "id" | "createdAt" | "currentAttendees">): Promise<Event> {
    return ApiService.post<Event>("/events", data)
  }

  static async update(id: string, data: Partial<Event>): Promise<Event> {
    return ApiService.put<Event>(`/events/${id}`, data)
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete(`/events/${id}`)
  }

  static async getAttendees(eventId: string): Promise<EventAttendee[]> {
    return ApiService.get<EventAttendee[]>(`/events/${eventId}/attendees`)
  }

  static async checkInAttendee(eventId: string, userId: string): Promise<void> {
    return ApiService.post(`/events/${eventId}/checkin`, { userId })
  }

  static async checkOutAttendee(eventId: string, userId: string): Promise<void> {
    return ApiService.post(`/events/${eventId}/checkout`, { userId })
  }

  static async getStats(): Promise<{
    total: number
    published: number
    draft: number
    cancelled: number
    totalAttendees: number
  }> {
    return ApiService.get("/events/stats")
  }
}
