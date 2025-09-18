"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, Eye, Mail, Phone, MapPin, Star, ExternalLink } from "lucide-react"

interface Professional {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  location: string
  rating: number
  reviewsCount: number
  experience: string
  description: string
  portfolio?: string
  isActive: boolean
  featuredWork?: string
}

interface ProfessionalCardProps {
  professional: Professional
  onEdit: (professional: Professional) => void
  onDelete: (id: string) => void
  onViewDetails: (professional: Professional) => void
}

export function ProfessionalCard({ professional, onEdit, onDelete, onViewDetails }: ProfessionalCardProps) {
  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {professional.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground">{professional.name}</h3>
              <p className="text-sm text-muted-foreground">{professional.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{professional.rating}</span>
                <span className="text-sm text-muted-foreground">({professional.reviewsCount} avaliações)</span>
              </div>
            </div>
          </div>
          <Badge variant={professional.isActive ? "default" : "secondary"}>
            {professional.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{professional.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{professional.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
            <MapPin className="h-4 w-4" />
            <span>{professional.location}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-card-foreground line-clamp-2">{professional.description}</p>
        </div>

        {professional.portfolio && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Portfólio disponível</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(professional)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(professional)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(professional.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
