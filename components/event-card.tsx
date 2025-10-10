"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Power, Eye, Calendar, MapPin, Users, Star } from "lucide-react"
import { Event } from "@/lib/services/events"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface EventCardProps {
  event: Event
  onEdit: (event: Event) => void
  onToggle: (event: Event) => void
  onViewDetails: (event: Event) => void
  onManageAttendees: (event: Event) => void
}

export function EventCard({ 
  event, 
  onEdit, 
  onToggle, 
  onViewDetails, 
  onManageAttendees 
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  const getOccupancyColor = () => {
    const percentage = (event.filledSpots / event.totalSpots) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getAddressString = () => {
    if (!event.address) return event.store?.name || "Local não definido"
    
    const { street, number, district, city, state } = event.address
    return `${street}, ${number} - ${district}, ${city}/${state}`
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-card-foreground line-clamp-1">
                {event.name}
              </h3>
              <Badge 
                variant="outline" 
                className={event.isActive 
                  ? "text-green-600 border-green-600" 
                  : "text-gray-600 border-gray-600"
                }
              >
                {event.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{event.type}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{getAddressString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className={getOccupancyColor()}>
              {event.filledSpots}/{event.totalSpots} participantes
            </span>
          </div>
          
          {event.points > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4" />
              <span className="text-primary font-medium">
                {event.points} pontos
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(event)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggle(event)}
            className={event.isActive ? "text-red-600" : "text-green-600"}
          >
            <Power className="h-4 w-4 mr-2" />
            {event.isActive ? "Desativar" : "Ativar"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onManageAttendees(event)}
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}