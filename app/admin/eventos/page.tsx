"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { EventCard } from "@/components/event-card"
import { EventFormModal } from "@/components/event-form-modal"
import { AttendeesModal } from "@/components/attendees-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download, Calendar } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxParticipants: number
  registeredCount: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  organizer: string
  price: number
  imageUrl?: string
}

// Mock data for events
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Workshop de Decoração Sustentável",
    description:
      "Aprenda técnicas de decoração usando materiais sustentáveis e eco-friendly. Workshop prático com profissionais renomados.",
    date: "2024-09-25",
    time: "14:00",
    location: "Centro de Convenções - São Paulo, SP",
    category: "Workshop",
    maxParticipants: 50,
    registeredCount: 35,
    status: "upcoming",
    organizer: "EcoDesign Brasil",
    price: 150.0,
  },
  {
    id: "2",
    title: "Palestra: Tendências em Arquitetura 2024",
    description:
      "Descubra as principais tendências em arquitetura para 2024. Palestrantes internacionais compartilham insights exclusivos.",
    date: "2024-09-20",
    time: "19:00",
    location: "Auditório Central - Rio de Janeiro, RJ",
    category: "Palestra",
    maxParticipants: 200,
    registeredCount: 180,
    status: "upcoming",
    organizer: "Instituto de Arquitetura",
    price: 0,
  },
  {
    id: "3",
    title: "Networking UPConnection",
    description:
      "Evento de networking para profissionais da área de decoração e arquitetura. Oportunidade única de fazer conexões.",
    date: "2024-09-15",
    time: "18:30",
    location: "Hotel Copacabana Palace - Rio de Janeiro, RJ",
    category: "Networking",
    maxParticipants: 100,
    registeredCount: 95,
    status: "ongoing",
    organizer: "UPConnection",
    price: 80.0,
  },
  {
    id: "4",
    title: "Curso de Iluminação Residencial",
    description:
      "Curso completo sobre iluminação residencial, desde conceitos básicos até projetos avançados com LED e automação.",
    date: "2024-08-30",
    time: "09:00",
    location: "Escola de Design - Belo Horizonte, MG",
    category: "Curso",
    maxParticipants: 30,
    registeredCount: 28,
    status: "completed",
    organizer: "Escola de Design MG",
    price: 300.0,
  },
  {
    id: "5",
    title: "Feira de Móveis e Decoração",
    description:
      "A maior feira de móveis e decoração do país. Mais de 500 expositores apresentando as últimas novidades do setor.",
    date: "2024-10-10",
    time: "10:00",
    location: "Expo Center Norte - São Paulo, SP",
    category: "Feira",
    maxParticipants: 5000,
    registeredCount: 1200,
    status: "upcoming",
    organizer: "Feira & Eventos",
    price: 25.0,
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
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

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      setEvents((prev) => prev.filter((e) => e.id !== id))
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

  const handleSave = (eventData: Omit<Event, "id" | "registeredCount">) => {
    if (formMode === "create") {
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        registeredCount: 0,
      }
      setEvents((prev) => [...prev, newEvent])
    } else if (selectedEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...eventData,
                id: selectedEvent.id,
                registeredCount: selectedEvent.registeredCount,
              }
            : e,
        ),
      )
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    const matchesStatus = statusFilter === "all" || event.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const upcomingCount = events.filter((e) => e.status === "upcoming").length
  const ongoingCount = events.filter((e) => e.status === "ongoing").length
  const completedCount = events.filter((e) => e.status === "completed").length
  const totalParticipants = events.reduce((acc, e) => acc + e.registeredCount, 0)

  const categories = [...new Set(events.map((e) => e.category))]

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
            <p className="text-muted-foreground">Gerencie eventos e validação de presença</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </div>
        </div>

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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximos</p>
                <p className="text-2xl font-bold text-card-foreground">{upcomingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-card-foreground">{ongoingCount}</p>
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
                <p className="text-2xl font-bold text-card-foreground">{totalParticipants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, descrição, local ou organizador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="upcoming">Próximos</SelectItem>
              <SelectItem value="ongoing">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} encontrado
            {filteredEvents.length !== 1 ? "s" : ""}
          </Badge>
          {categoryFilter !== "all" && (
            <Badge variant="outline" className="text-primary">
              Categoria: {categoryFilter}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline" className="text-secondary">
              Status:{" "}
              {statusFilter === "upcoming"
                ? "Próximos"
                : statusFilter === "ongoing"
                  ? "Em Andamento"
                  : statusFilter === "completed"
                    ? "Concluídos"
                    : "Cancelados"}
            </Badge>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onManageAttendees={handleManageAttendees}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
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
        />
      </div>
    </AdminLayout>
  )
}
