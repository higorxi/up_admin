"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, Eye, Mail, Phone, MapPin, MessageCircle, Instagram, Linkedin, Calendar } from "lucide-react"

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
  const hasInstagram = professional.socialMedia?.instagram
  const hasLinkedin = professional.socialMedia?.linkedin

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-14 w-14 border-2 border-primary/10 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-base font-semibold">
                {getInitials(professional.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-card-foreground truncate">{professional.name}</h3>
              <p className="text-sm font-medium text-primary capitalize">{professional.profession}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge 
                  variant="outline" 
                  className={professional.isActive 
                    ? "text-green-700 border-green-500 bg-green-50 font-medium text-xs" 
                    : "text-gray-700 border-gray-500 bg-gray-50 font-medium text-xs"
                  }
                >
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
      
      <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="font-mono">{formatPhone(professional.phone)}</span>
          </div>
          
          {professional.email && (
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="truncate">{professional.email}</span>
            </div>
          )}
          
          <div className="flex items-start gap-2.5 text-sm">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground">{formatLocation()}</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3.5 border border-border/50 min-h-[88px] flex items-start flex-1">
          <p className="text-sm text-card-foreground/80 line-clamp-3 leading-relaxed">
            {professional.description || 'Sem descrição disponível'}
          </p>
        </div>

        <div className="mt-auto pt-2 space-y-3">
          {(hasInstagram || hasLinkedin || hasWhatsApp) && (
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              {hasInstagram && (
                <a
                  href={`https://instagram.com/${professional.socialMedia?.instagram?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110 transition-transform shadow-sm"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5 text-white" />
                </a>
              )}
              {hasLinkedin && (
                <a
                  href={professional.socialMedia?.linkedin || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-600 hover:scale-110 transition-transform shadow-sm"
                  title="LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5 text-white" />
                </a>
              )}
              {hasWhatsApp && (
                <a
                  href={`https://wa.me/${professional.socialMedia?.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-green-500 hover:scale-110 transition-transform shadow-sm"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-white" />
                </a>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onViewDetails(professional)} 
              className="flex-1 shadow-sm transition-all"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Detalhes
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(professional)}
              className="hover:bg-muted/50 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(professional.id)}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}