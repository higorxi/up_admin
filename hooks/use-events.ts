"use client"

import { useState, useEffect } from "react"
import { EventsService, type Event, type CreateEventData, type EventRegistration } from "@/lib/services/events"
import { useAuth } from "./use-auth"

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: CreateEventData) => Promise<void>
  update: (id: string, data: CreateEventData) => Promise<void>
  toggleEvent: (id: string) => Promise<void>
  checkInAttendee: (eventId: string, professionalId: string) => Promise<void>
  getEventParticipants: (eventId: string) => Promise<EventRegistration[]>
}

export function useEvents(): UseEventsReturn {
  const { isAuthenticated } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const eventsData = await EventsService.getAll()
      setEvents(eventsData)
    } catch (err) {
      console.error("[useEvents] Error fetching events:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar eventos")
    } finally {
      setLoading(false)
    }
  }

  const create = async (data: CreateEventData) => {
    try {
      const newEvent = await EventsService.create(data)
      setEvents((prev) => [...prev, newEvent])
    } catch (err) {
      console.error("[useEvents] Error creating event:", err)
      throw err
    }
  }

  const update = async (id: string, data: CreateEventData) => {
    try {
      const updatedEvent = await EventsService.update(id, data)
      setEvents((prev) => 
        prev.map((event) => (event.id === id ? updatedEvent : event))
      )
    } catch (err) {
      console.error("[useEvents] Error updating event:", err)
      throw err
    }
  }

  const toggleEvent = async (id: string) => {
    try {
      const updatedEvent = await EventsService.toggleEvent(id)
      setEvents((prev) => 
        prev.map((event) => (event.id === id ? updatedEvent : event))
      )
    } catch (err) {
      console.error("[useEvents] Error toggling event:", err)
      throw err
    }
  }

  const checkInAttendee = async (eventId: string, professionalId: string) => {
    try {
      await EventsService.checkInAttendee(eventId, professionalId)
      // Atualizar o evento específico com os novos dados de participantes
      await fetchEvents() // Refetch para garantir dados atualizados
    } catch (err) {
      console.error("[useEvents] Error checking in attendee:", err)
      throw err
    }
  }

  const getEventParticipants = async (eventId: string): Promise<EventRegistration[]> => {
    try {
      return await EventsService.getEventParticipants(eventId)
    } catch (err) {
      console.error("[useEvents] Error fetching event participants:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [isAuthenticated])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    create,
    update,
    toggleEvent,
    checkInAttendee,
    getEventParticipants,
  }
}