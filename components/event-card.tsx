"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Calendar, MapPin, Users } from "lucide-react"

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

interface EventCardProps {
  event: Event
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
  onViewDetails: (event: Event) => void
  onManageAttendees: (event: Event) => void
}

export function EventCard({ event, onEdit, onDelete, onViewDetails, onManageAttendees }: EventCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Próximo
          </Badge>
        )
      case "ongoing":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Em Andamento
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600">
            Concluído
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

  const getOccupancyColor = () => {
    const percentage = (event.registeredCount / event.maxParticipants) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-card-foreground line-clamp-1">{event.title}</h3>
              {getStatusBadge(event.status)}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{event.category}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {event.date} às {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className={getOccupancyColor()}>
              {event.registeredCount}/{event.maxParticipants} participantes
            </span>
          </div>
          {event.price > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-primary font-medium">R$ {event.price.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(event)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Detalhes
          </Button>
          <Button variant="outline" size="sm" onClick={() => onManageAttendees(event)}>
            <Users className="h-4 w-4 mr-2" />
            Participantes
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(event)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(event.id)} className="flex-1">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
