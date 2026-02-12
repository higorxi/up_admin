"use client"

import { useState, useEffect } from "react"
import { useEvents } from "@/hooks/use-events"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { EventCard } from "@/components/event-card"
import { EventFormModal } from "@/components/event-form-modal"
import { AttendeesModal } from "@/components/attendees-modal"
import { CardSkeleton } from "@/components/card-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, Calendar, RefreshCw } from "lucide-react"
import { Event, CreateEventData } from "@/lib/services/events"

export default function EventsPage() {
  const { 
    events, 
    loading, 
    error, 
    refetch, 
    create, 
    update,
    toggleEvent,
    checkInAttendee,
    getEventParticipants 
  } = useEvents()
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleCreate = () => {
    setSelectedEvent(null)
    setFormMode("create")
    setIsFormModalOpen(true)
  }

  const handleEdit = (event: Event) => {
    setSelectedEvent(event)
    setFormMode("edit")
    setIsFormModalOpen(true)
  }

  const handleToggleEvent = async (event: Event) => {
    try {
      await toggleEvent(event.id)
    } catch (error) {
      console.error("Erro ao alternar status do evento:", error)
    }
  }

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event)
    // Could open a details modal here
  }

  const handleManageAttendees = (event: Event) => {
    setSelectedEvent(event)
    setIsAttendeesModalOpen(true)
  }

  const handleSave = async (eventData: CreateEventData) => {
    try {
      if (formMode === "create") {
        await create(eventData)
      } else if (selectedEvent) {
        await update(selectedEvent.id, eventData)
      }
      setIsFormModalOpen(false)
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
    }
  }

  const handleCheckIn = async (eventId: string, professionalId: string) => {
    try {
      await checkInAttendee(eventId, professionalId)
    } catch (error) {
      console.error("Erro ao fazer check-in:", error)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.store?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.address && `${event.address.street} ${event.address.city}`.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || event.type === typeFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && event.isActive) ||
      (statusFilter === "inactive" && !event.isActive)

    return matchesSearch && matchesType && matchesStatus
  })

  const activeCount = events.filter((e) => e.isActive).length
  const inactiveCount = events.filter((e) => !e.isActive).length
  const totalParticipants = events.reduce((acc, e) => acc + e.filledSpots, 0)
  const totalSpots = events.reduce((acc, e) => acc + e.totalSpots, 0)

  const eventTypes = [...new Set(events.map((e) => e.type))]

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Eventos"
        description="Gerencie eventos e validação de presença"
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              disabled={loading}
              className="transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button 
              size="sm" 
              onClick={handleCreate} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </>
        }
      >
        {error && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Eventos</p>
                <p className="text-2xl font-bold text-card-foreground">{events.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-card-foreground">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativos</p>
                <p className="text-2xl font-bold text-card-foreground">{inactiveCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participantes</p>
                <p className="text-2xl font-bold text-card-foreground">{totalParticipants}/{totalSpots}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, descrição, loja ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48 border-border/50">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36 border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-muted-foreground border-border/50 bg-muted/30 font-medium">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} encontrado
            {filteredEvents.length !== 1 ? "s" : ""}
          </Badge>
          {typeFilter !== "all" && (
            <Badge variant="outline" className="border-primary/50 bg-primary/5 text-primary font-medium">
              Tipo: {typeFilter}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline" className="border-secondary/50 bg-secondary/5 text-secondary font-medium">
              Status: {statusFilter === "active" ? "Ativos" : "Inativos"}
            </Badge>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <CardSkeleton count={6} />
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEdit}
                onToggle={handleToggleEvent}
                onViewDetails={handleViewDetails}
                onManageAttendees={handleManageAttendees}
              />
            ))
          )}
        </div>

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground">
              {events.length === 0 
                ? "Ainda não há eventos cadastrados. Clique em 'Criar Evento' para começar."
                : "Tente ajustar os filtros ou termos de busca."
              }
            </p>
          </div>
        )}

        {/* Modals */}
        <EventFormModal
          event={selectedEvent}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSave}
          mode={formMode}
        />

        <AttendeesModal
          event={selectedEvent}
          isOpen={isAttendeesModalOpen}
          onClose={() => setIsAttendeesModalOpen(false)}
          onCheckIn={handleCheckIn}
          getParticipants={getEventParticipants}
        />
      </AdminPageLayout>
    </AdminLayout>
  )
}