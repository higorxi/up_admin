"use client"

import { AdminDialog } from "@/components/admin-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, Calendar, Hash, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, User } from "lucide-react"
import { RecommendedProfessional, WeekDay } from "@/lib/services/recommended-professional"

interface ProfessionalDetailsModalProps {
  professional: RecommendedProfessional | null
  isOpen: boolean
  onClose: () => void
}

const weekDayLabels: Record<WeekDay, string> = {
  SUNDAY: "Domingo",
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
}

export function ProfessionalDetailsModal({ professional, isOpen, onClose }: ProfessionalDetailsModalProps) {
  if (!professional) return null

  const formatPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`
    }
    return phone
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter((word) => word.length > 0)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const formatAddress = () => {
    if (!professional.address) return null
    const { street, number, district, city, state, zipCode, complement } = professional.address

    return {
      full: `${street || ""}${number ? `, ${number}` : ""}${complement ? `, ${complement}` : ""} - ${district}, ${city} - ${state}`.trim(),
      zipCode,
    }
  }

  const address = formatAddress()

  const openWhatsApp = () => {
    if (!professional.socialMedia?.whatsapp) return
    const cleanNumber = professional.socialMedia.whatsapp.replace(/\D/g, "")
    window.open(`https://wa.me/${cleanNumber}`, "_blank")
  }

  const openInstagram = () => {
    if (!professional.socialMedia?.instagram) return
    const username = professional.socialMedia.instagram.replace("@", "")
    window.open(`https://instagram.com/${username}`, "_blank")
  }

  const openLinkedIn = () => {
    if (!professional.socialMedia?.linkedin) return
    window.open(professional.socialMedia.linkedin, "_blank")
  }

  return (
    <AdminDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Visualizar Profissional"
      description="Consulte dados cadastrais, contato, localização e informações do sistema."
      icon={<User className="h-6 w-6 flex-shrink-0" />}
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {getInitials(professional.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-3">
              <span className="truncate text-xl font-semibold">{professional.name}</span>
              <Badge variant={professional.isActive ? "default" : "secondary"}>
                {professional.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-lg text-primary font-medium capitalize">{professional.profession}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </h3>
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Telefone</p>
                <p className="font-mono text-lg">{formatPhone(professional.phone)}</p>
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
                  <p className="font-mono text-sm">{professional.socialMedia.whatsapp}</p>
                </div>
                <Button size="sm" variant="outline" onClick={openWhatsApp} className="text-green-600 border-green-600 hover:bg-green-50">
                  Abrir WhatsApp
                </Button>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {(professional.socialMedia?.instagram || professional.socialMedia?.linkedin) && (
          <>
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
                <Building2 className="h-5 w-5" />
                Redes Sociais
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {professional.socialMedia?.instagram && (
                  <div className="rounded-lg bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <Instagram className="h-5 w-5 text-pink-600" />
                      <div className="flex-1">
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm">{professional.socialMedia.instagram}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={openInstagram} className="hover:bg-pink-50">
                        Abrir
                      </Button>
                    </div>
                  </div>
                )}

                {professional.socialMedia?.linkedin && (
                  <div className="rounded-lg bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">LinkedIn</p>
                        <p className="truncate text-sm">{professional.socialMedia.linkedin}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={openLinkedIn} className="hover:bg-blue-50">
                        Abrir
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {address && (
          <>
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
                <MapPin className="h-5 w-5" />
                Localização
              </h3>
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <p className="text-sm leading-relaxed">{address.full}</p>
                {address.zipCode && (
                  <div className="flex items-center gap-2 border-t pt-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{address.zipCode}</span>
                  </div>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        <div>
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
            <Building2 className="h-5 w-5" />
            Informações Profissionais
          </h3>
          <div className="space-y-4 rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Profissão</p>
                <p className="text-lg capitalize">{professional.profession}</p>
              </div>
            </div>

            {professional.description && (
              <div>
                <p className="mb-2 font-medium">Descrição</p>
                <p className="rounded-lg bg-background p-3 text-sm text-muted-foreground leading-relaxed">
                  {professional.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {professional.availableDays && professional.availableDays.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
                <Calendar className="h-5 w-5" />
                Dias Disponíveis
              </h3>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="flex flex-wrap gap-2">
                  {professional.availableDays.map((day) => (
                    <Badge key={day.id} variant="outline" className="px-3 py-1.5 text-sm">
                      {weekDayLabels[day.dayOfWeek]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        <div>
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
            <Calendar className="h-5 w-5" />
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-muted/30 p-4">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Cadastrado em</p>
              <p className="text-sm">{formatDate(professional.createdAt)}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-4">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Última atualização</p>
              <p className="text-sm">{formatDate(professional.updatedAt)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted/30 p-4">
            <p className="mb-1 text-sm font-medium text-muted-foreground">ID do Profissional</p>
            <p className="break-all font-mono text-xs text-muted-foreground">{professional.id}</p>
          </div>
        </div>
      </div>
    </AdminDialog>
  )
}