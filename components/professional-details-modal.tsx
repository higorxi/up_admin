"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, MessageCircle, Calendar, User, Building2, Hash } from "lucide-react"

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

interface ProfessionalDetailsModalProps {
  professional: Professional | null
  isOpen: boolean
  onClose: () => void
}

export function ProfessionalDetailsModal({ professional, isOpen, onClose }: ProfessionalDetailsModalProps) {
  if (!professional) return null

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = () => {
    if (!professional.address) return null
    const { street, number, district, city, state, zipCode, complement } = professional.address
    
    return {
      full: `${street}${number ? `, ${number}` : ''}${complement ? `, ${complement}` : ''} - ${district}, ${city} - ${state}`,
      zipCode: zipCode
    }
  }

  const address = formatAddress()

  const openWhatsApp = () => {
    if (professional.socialMedia?.whatsapp) {
      const cleanNumber = professional.socialMedia.whatsapp.replace(/\D/g, '')
      window.open(`https://wa.me/${cleanNumber}`, '_blank')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {getInitials(professional.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">{professional.name}</span>
                <Badge variant={professional.isActive ? "default" : "secondary"}>
                  {professional.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-lg text-primary font-medium capitalize">{professional.profession}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações de Contato */}
          <div>
            <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 gap-4 bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-lg font-mono">{formatPhone(professional.phone)}</p>
                </div>
              </div>
              
              {professional.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-sm">{professional.email}</p>
                  </div>
                </div>
              )}

              {professional.socialMedia?.whatsapp && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm font-mono">{professional.socialMedia.whatsapp}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={openWhatsApp} className="text-green-600 border-green-600">
                    Abrir WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Localização */}
          {address && (
            <div>
              <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm mb-2">{address.full}</p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{address.zipCode}</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Informações Profissionais */}
          <div>
            <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações Profissionais
            </h3>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Profissão</p>
                  <p className="capitalize text-lg">{professional.profession}</p>
                </div>
              </div>
              
              {professional.description && (
                <div>
                  <p className="font-medium mb-2">Descrição</p>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-background rounded-lg p-3">
                    {professional.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações do Sistema */}
          <div>
            <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-medium mb-1">Cadastrado em</p>
                <p className="text-sm text-muted-foreground">{formatDate(professional.createdAt)}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="font-medium mb-1">Última atualização</p>
                <p className="text-sm text-muted-foreground">{formatDate(professional.updatedAt)}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-muted/30 rounded-lg p-4">
              <p className="font-medium mb-1">ID do Profissional</p>
              <p className="text-xs font-mono text-muted-foreground break-all">{professional.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}