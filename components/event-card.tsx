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
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-card-foreground truncate">
                {event.name}
              </h3>
              <Badge 
                variant="outline" 
                className={event.isActive 
                  ? "text-green-700 border-green-500 bg-green-50 font-medium" 
                  : "text-gray-700 border-gray-500 bg-gray-50 font-medium"
                }
              >
                {event.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 font-medium">{event.type}</p>
            <p className="text-sm text-card-foreground/80 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col pt-0">
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="truncate">{getAddressString()}</span>
          </div>
          
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <span className={`${getOccupancyColor()} font-medium`}>
              {event.filledSpots}/{event.totalSpots} participantes
            </span>
          </div>
          
          {event.points > 0 && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <span className="text-primary font-semibold">
                {event.points} pontos
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3 mt-auto border-t border-border/50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(event)}
            className="flex-1 hover:bg-muted/50 transition-colors"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Editar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggle(event)}
            className={`flex-1 transition-colors ${event.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
          >
            <Power className="h-4 w-4 mr-1.5" />
            {event.isActive ? "Desativar" : "Ativar"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onManageAttendees(event)}
            className="hover:bg-muted/50 transition-colors"
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}