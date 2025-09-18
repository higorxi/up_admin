"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Star, ExternalLink, Award, Calendar } from "lucide-react"

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

interface ProfessionalDetailsModalProps {
  professional: Professional | null
  isOpen: boolean
  onClose: () => void
}

export function ProfessionalDetailsModal({ professional, isOpen, onClose }: ProfessionalDetailsModalProps) {
  if (!professional) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {professional.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span>{professional.name}</span>
                <Badge variant={professional.isActive ? "default" : "secondary"}>
                  {professional.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-normal">{professional.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{professional.rating}</span>
                <span className="text-sm text-muted-foreground">({professional.reviewsCount} avaliações)</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3 text-card-foreground">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{professional.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{professional.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm md:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{professional.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional Info */}
          <div>
            <h3 className="font-semibold mb-3 text-card-foreground">Informações Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>Especialidade: {professional.specialty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Experiência: {professional.experience}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3 text-card-foreground">Descrição Profissional</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{professional.description}</p>
          </div>

          {professional.featuredWork && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 text-card-foreground">Trabalho em Destaque</h3>
                <p className="text-sm text-muted-foreground">{professional.featuredWork}</p>
              </div>
            </>
          )}

          {professional.portfolio && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 text-card-foreground">Portfólio</h3>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  Ver Portfólio Online
                </Button>
              </div>
            </>
          )}

          <Separator />

          {/* Statistics */}
          <div>
            <h3 className="font-semibold mb-3 text-card-foreground">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-card-foreground">{professional.rating}</div>
                <div className="text-sm text-muted-foreground">Avaliação Média</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-card-foreground">{professional.reviewsCount}</div>
                <div className="text-sm text-muted-foreground">Total de Avaliações</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
