"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, MapPin, RefreshCw } from "lucide-react"
import { Event, CreateEventData } from "@/lib/services/events"
import { useStores } from "@/hooks/use-stores"


interface EventFormModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateEventData) => Promise<void>
  mode: "create" | "edit"
}

const eventTypes = [
  "Workshop",
  "Palestra", 
  "Networking",
  "Curso",
  "Feira",
  "Treinamento",
  "Seminário"
]

export function EventFormModal({ 
  event, 
  isOpen, 
  onClose, 
  onSave, 
  mode 
}: EventFormModalProps) {
  const { stores, loading: storesLoading, error: storesError } = useStores()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [includeAddress, setIncludeAddress] = useState(false)

  const [formData, setFormData] = useState<CreateEventData>({
    name: "",
    description: "",
    date: "",
    type: "",
    points: 0,
    totalSpots: 1,
    storeId: "",
  })

  // Reset form quando abrir/fechar modal
  useEffect(() => {
    if (isOpen) {
      if (event && mode === "edit") {
        // Para edit, converter a data do formato ISO para datetime-local
        const eventDate = new Date(event.date)
        const formattedDate = eventDate.toISOString().slice(0, 16)
        
        setFormData({
          name: event.name,
          description: event.description,
          date: formattedDate,
          type: event.type,
          points: event.points,
          totalSpots: event.totalSpots,
          storeId: event.storeId,
          address: event.address ? {
            street: event.address.street,
            district: event.address.district,
            city: event.address.city,
            state: event.address.state,
            zipCode: event.address.zipCode,
            number: event.address.number,
            complement: event.address.complement,
          } : undefined,
        })
        setIncludeAddress(!!event.address)
      } else {
        // Reset para modo create
        setFormData({
          name: "",
          description: "",
          date: "",
          type: "",
          points: 0,
          totalSpots: 1,
          storeId: "",
        })
        setIncludeAddress(false)
      }
      setError(null)
    }
  }, [event, isOpen, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validar campos obrigatórios
      if (!formData.name.trim()) {
        throw new Error("Nome é obrigatório")
      }
      if (!formData.description.trim()) {
        throw new Error("Descrição é obrigatória")
      }
      if (!formData.date) {
        throw new Error("Data é obrigatória")
      }
      if (!formData.type) {
        throw new Error("Tipo é obrigatório")
      }
      if (!formData.storeId) {
        throw new Error("Loja é obrigatória")
      }
      if (formData.totalSpots < 1) {
        throw new Error("Total de vagas deve ser maior que 0")
      }

      // Preparar dados para envio
      const dataToSend: CreateEventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString(),
        type: formData.type,
        points: Number(formData.points),
        totalSpots: Number(formData.totalSpots),
        storeId: formData.storeId,
      }

      // Adicionar endereço se incluído
      if (includeAddress && formData.address) {
        if (!formData.address.street?.trim() || 
            !formData.address.district?.trim() ||
            !formData.address.city?.trim() || 
            !formData.address.state?.trim() || 
            !formData.address.zipCode?.trim() || 
            !formData.address.number?.trim()) {
          throw new Error("Todos os campos obrigatórios do endereço devem ser preenchidos")
        }

        dataToSend.address = {
          street: formData.address.street.trim(),
          district: formData.address.district.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          zipCode: formData.address.zipCode.trim(),
          number: formData.address.number.trim(),
          complement: formData.address.complement?.trim(),
        }
      }

      await onSave(dataToSend)
      onClose()
    } catch (err) {
      console.error("Error saving event:", err)
      setError(err instanceof Error ? err.message : "Erro ao salvar evento")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        street: prev.address?.street || "",
        district: prev.address?.district || "",
        city: prev.address?.city || "",
        state: prev.address?.state || "",
        zipCode: prev.address?.zipCode || "",
        number: prev.address?.number || "",
        complement: prev.address?.complement || "",
        [field]: value,
      }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Novo Evento" : "Editar Evento"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {storesError && (
          <Alert variant="destructive">
            <AlertDescription>Erro ao carregar lojas: {storesError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Evento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Ex: Workshop de Decoração Sustentável"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Descreva o evento, objetivos e o que será abordado..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data e Hora *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => updateFormData("date", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo do Evento *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => updateFormData("type", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={formData.points}
                  onChange={(e) => updateFormData("points", parseInt(e.target.value) || 0)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="totalSpots">Total de Vagas *</Label>
                <Input
                  id="totalSpots"
                  type="number"
                  min="1"
                  value={formData.totalSpots}
                  onChange={(e) => updateFormData("totalSpots", parseInt(e.target.value) || 1)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="storeId">Loja *</Label>
              <Select
                value={formData.storeId}
                onValueChange={(value) => updateFormData("storeId", value)}
                disabled={loading || storesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    storesLoading ? "Carregando lojas..." : "Selecione a loja"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {storesLoading && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Carregando lojas...
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Endereço opcional */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeAddress"
                checked={includeAddress}
                onChange={(e) => setIncludeAddress(e.target.checked)}
                disabled={loading}
              />
              <Label htmlFor="includeAddress" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adicionar endereço específico
              </Label>
            </div>

            {includeAddress && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="street">Rua *</Label>
                    <Input
                      id="street"
                      value={formData.address?.street || ""}
                      onChange={(e) => updateAddress("street", e.target.value)}
                      placeholder="Nome da rua"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">Bairro *</Label>
                    <Input
                      id="district"
                      value={formData.address?.district || ""}
                      onChange={(e) => updateAddress("district", e.target.value)}
                      placeholder="Nome do bairro"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      value={formData.address?.number || ""}
                      onChange={(e) => updateAddress("number", e.target.value)}
                      placeholder="123"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={formData.address?.complement || ""}
                      onChange={(e) => updateAddress("complement", e.target.value)}
                      placeholder="Apto, sala..."
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.address?.city || ""}
                      onChange={(e) => updateAddress("city", e.target.value)}
                      placeholder="São Paulo"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      value={formData.address?.state || ""}
                      onChange={(e) => updateAddress("state", e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input
                      id="zipCode"
                      value={formData.address?.zipCode || ""}
                      onChange={(e) => updateAddress("zipCode", e.target.value)}
                      placeholder="01234-567"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || storesLoading}>
              {loading ? "Salvando..." : mode === "create" ? "Criar Evento" : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}