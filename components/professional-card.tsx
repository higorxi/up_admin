"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, Eye, Mail, Phone, MapPin, Star, MessageCircle } from "lucide-react"

interface Professional {
  id: string
  name: string
  profession: string
  description: string
  phone: string
  email: string | null
  profileImage: string | null
  isActive: boolean
  address: {
    id: string
    state: string
    city: string
    district: string
    street: string
    complement: string | null
    number: string | null
    zipCode: string
  } | null
  socialMedia: {
    id: string
    linkedin: string | null
    instagram: string | null
    whatsapp: string | null
  } | null
  availableDays: any[]
  createdAt: string
  updatedAt: string
}

interface ProfessionalCardProps {
  professional: Professional
  onEdit: (professional: Professional) => void
  onDelete: (id: string) => void
  onViewDetails: (professional: Professional) => void
}

export function ProfessionalCard({ professional, onEdit, onDelete, onViewDetails }: ProfessionalCardProps) {
  const formatPhone = (phone: string) => {
    // Remove qualquer formatação existente e espaços extras
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`
    }
    return phone
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const formatLocation = () => {
    if (!professional.address) return 'Localização não informada'
    const { city, district, state } = professional.address
    return `${district}, ${city} - ${state}`
  }

  const hasWhatsApp = professional.socialMedia?.whatsapp

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground text-base font-semibold">
                {getInitials(professional.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-card-foreground truncate">{professional.name}</h3>
              <p className="text-sm font-medium text-primary capitalize">{professional.profession}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={professional.isActive ? "default" : "secondary"} className="text-xs">
                  {professional.isActive ? "Ativo" : "Inativo"}
                </Badge>
                {hasWhatsApp && (
                  <MessageCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-mono">{formatPhone(professional.phone)}</span>
          </div>
          
          {professional.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{professional.email}</span>
            </div>
          )}
          
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{formatLocation()}</span>
          </div>
        </div>

        {professional.description && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-card-foreground line-clamp-3 leading-relaxed">
              {professional.description}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onViewDetails(professional)} 
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(professional)}
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(professional.id)}
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}