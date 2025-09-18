"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Tag, ImageIcon } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxAttendees: number
  currentAttendees: number
  status: "draft" | "published" | "cancelled"
  image: string
  createdAt: string
}

interface EventFormModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<Event, "id" | "currentAttendees" | "createdAt">) => Promise<void>
  mode: "create" | "edit"
}

const categories = [
  "Workshop",
  "Palestra",
  "Networking",
  "Curso",
  "Seminário",
  "Mesa Redonda",
  "Exposição",
  "Feira",
  "Lançamento",
  "Outros",
]

const statuses = [
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
  { value: "cancelled", label: "Cancelado" },
]

export function EventFormModal({ event, isOpen, onClose, onSave, mode }: EventFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxAttendees: 50,
    status: "draft" as const,
    image: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (event && mode === "edit") {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        maxAttendees: event.maxAttendees,
        status: event.status,
        image: event.image,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        maxAttendees: 50,
        status: "draft",
        image: "",
      })
    }
    setErrors({})
  }, [event, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório"
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória"
    if (!formData.date) newErrors.date = "Data é obrigatória"
    if (!formData.time) newErrors.time = "Horário é obrigatório"
    if (!formData.location.trim()) newErrors.location = "Local é obrigatório"
    if (!formData.category) newErrors.category = "Categoria é obrigatória"
    if (formData.maxAttendees <= 0) newErrors.maxAttendees = "Número de participantes deve ser maior que zero"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Rascunho
          </Badge>
        )
      case "published":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Publicado
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5" />
            {mode === "create" ? "Criar Evento" : "Editar Evento"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* Basic Information */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informações Básicas
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o evento, objetivos e o que os participantes podem esperar..."
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={isLoading}
                      >
                        <SelectTrigger className={`pl-10 ${errors.category ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(status.value)}
                              <span>{status.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Date and Location */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Data e Local
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`pl-10 ${errors.date ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className={`pl-10 ${errors.time ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Endereço completo ou plataforma online"
                    className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Máximo de Participantes *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="maxAttendees"
                      type="number"
                      min="1"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData({ ...formData, maxAttendees: Number.parseInt(e.target.value) || 0 })}
                      className={`pl-10 ${errors.maxAttendees ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.maxAttendees && <p className="text-sm text-red-500">{errors.maxAttendees}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL da Imagem</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
            {isLoading ? "Salvando..." : mode === "create" ? "Criar Evento" : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
