"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Check, X, Mail, Phone, Calendar, Download } from "lucide-react"

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

interface Attendee {
  id: string
  name: string
  email: string
  phone: string
  registrationDate: string
  status: "confirmed" | "pending" | "cancelled"
  attended: boolean
  checkInTime?: string
}

interface AttendeesModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

// Mock data for attendees
const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@email.com",
    phone: "(11) 99999-9999",
    registrationDate: "2024-08-15",
    status: "confirmed",
    attended: true,
    checkInTime: "14:30",
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos@email.com",
    phone: "(21) 88888-8888",
    registrationDate: "2024-08-16",
    status: "confirmed",
    attended: false,
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria@email.com",
    phone: "(31) 77777-7777",
    registrationDate: "2024-08-17",
    status: "pending",
    attended: false,
  },
  {
    id: "4",
    name: "João Costa",
    email: "joao@email.com",
    phone: "(85) 66666-6666",
    registrationDate: "2024-08-18",
    status: "confirmed",
    attended: true,
    checkInTime: "14:45",
  },
  {
    id: "5",
    name: "Fernanda Lima",
    email: "fernanda@email.com",
    phone: "(47) 55555-5555",
    registrationDate: "2024-08-19",
    status: "cancelled",
    attended: false,
  },
]

export function AttendeesModal({ event, isOpen, onClose }: AttendeesModalProps) {
  const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  if (!event) return null

  const handleCheckIn = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        attendee.id === attendeeId
          ? {
              ...attendee,
              attended: true,
              checkInTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            }
          : attendee,
      ),
    )
  }

  const handleCheckOut = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        attendee.id === attendeeId ? { ...attendee, attended: false, checkInTime: undefined } : attendee,
      ),
    )
  }

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "confirmed" && attendee.status === "confirmed") ||
      (activeTab === "pending" && attendee.status === "pending") ||
      (activeTab === "attended" && attendee.attended) ||
      (activeTab === "not-attended" && !attendee.attended && attendee.status === "confirmed")

    return matchesSearch && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Confirmado
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const confirmedCount = attendees.filter((a) => a.status === "confirmed").length
  const attendedCount = attendees.filter((a) => a.attended).length
  const pendingCount = attendees.filter((a) => a.status === "pending").length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Participantes - {event.title}</span>
            <Badge variant="outline" className="text-primary">
              {attendees.length} inscritos
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-card-foreground">{attendees.length}</div>
              <div className="text-sm text-muted-foreground">Total Inscritos</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
              <div className="text-sm text-muted-foreground">Confirmados</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{attendedCount}</div>
              <div className="text-sm text-muted-foreground">Presentes</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar Lista
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="attended">Presentes</TabsTrigger>
              <TabsTrigger value="not-attended">Ausentes</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-3">
                {filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {attendee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-card-foreground">{attendee.name}</h4>
                        {getStatusBadge(attendee.status)}
                        {attendee.attended && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Presente {attendee.checkInTime && `- ${attendee.checkInTime}`}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{attendee.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{attendee.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Inscrito em {attendee.registrationDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {attendee.status === "confirmed" && (
                        <>
                          {!attendee.attended ? (
                            <Button size="sm" onClick={() => handleCheckIn(attendee.id)} className="gap-2">
                              <Check className="h-4 w-4" />
                              Check-in
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckOut(attendee.id)}
                              className="gap-2 bg-transparent"
                            >
                              <X className="h-4 w-4" />
                              Desfazer
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {filteredAttendees.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum participante encontrado.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
