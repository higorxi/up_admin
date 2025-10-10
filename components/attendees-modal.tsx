"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Check, X, Mail, Calendar, RefreshCw, Users } from "lucide-react"
import { Event, EventRegistration } from "@/lib/services/events"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AttendeesModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onCheckIn: (eventId: string, professionalId: string) => Promise<void>
  getParticipants: (eventId: string) => Promise<EventRegistration[]>
}

export function AttendeesModal({ 
  event, 
  isOpen, 
  onClose, 
  onCheckIn, 
  getParticipants 
}: AttendeesModalProps) {
  const [participants, setParticipants] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (isOpen && event?.id) {
      loadParticipants()
    } else {
      // Reset state quando fechar modal
      setParticipants([])
      setSearchTerm("")
      setActiveTab("all")
      setError(null)
    }
  }, [isOpen, event?.id])

  const loadParticipants = async () => {
    if (!event?.id) return

    try {
      setLoading(true)
      setError(null)
      const data = await getParticipants(event.id)
      setParticipants(data)
    } catch (err) {
      console.error("Error loading participants:", err)
      setError("Erro ao carregar participantes")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (professionalId: string) => {
    if (!event?.id) return

    try {
      await onCheckIn(event.id, professionalId)
      // Recarregar participantes para mostrar o status atualizado
      await loadParticipants()
    } catch (err) {
      console.error("Error checking in:", err)
      setError("Erro ao fazer check-in")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch {
      return dateString
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!event) return null

  const filteredParticipants = participants.filter((participant) => {
    const professional = participant.professional
    if (!professional) return false

    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "checked-in" && participant.checkedIn) ||
      (activeTab === "not-checked-in" && !participant.checkedIn)

    return matchesSearch && matchesTab
  })

  const checkedInCount = participants.filter(p => p.checkedIn).length
  const notCheckedInCount = participants.filter(p => !p.checkedIn).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <span className="text-lg">{event.name} - Participantes</span>
            <Badge variant="outline" className="text-primary">
              {participants.length} inscritos
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col px-6 py-4 space-y-4 overflow-hidden">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-card-foreground">{participants.length}</div>
              <div className="text-xs text-muted-foreground">Total Inscritos</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{checkedInCount}</div>
              <div className="text-xs text-muted-foreground">Check-in Feito</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-yellow-600">{notCheckedInCount}</div>
              <div className="text-xs text-muted-foreground">Pendente</div>
            </div>
          </div>

          {/* Search e Refresh */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadParticipants}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-3">
              <TabsTrigger value="all" className="text-xs">
                Todos ({participants.length})
              </TabsTrigger>
              <TabsTrigger value="checked-in" className="text-xs">
                Check-in Feito ({checkedInCount})
              </TabsTrigger>
              <TabsTrigger value="not-checked-in" className="text-xs">
                Pendente ({notCheckedInCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Carregando participantes...</span>
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {filteredParticipants.map((participant) => {
                      const professional = participant.professional
                      if (!professional) return null

                      return (
                        <div
                          key={participant.id}
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-muted/25 transition-colors"
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {getInitials(professional.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-card-foreground text-sm truncate">
                                {professional.name}
                              </h4>
                              {participant.checkedIn ? (
                                <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                  Check-in Feito
                                  {participant.checkedInAt && (
                                    <span className="ml-1">
                                      {formatDateTime(participant.checkedInAt)}
                                    </span>
                                  )}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                                  Pendente
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate">{professional.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span>Inscrito em {formatDate(participant.registeredAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            {!participant.checkedIn ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleCheckIn(professional.id)} 
                                className="gap-1 text-xs px-3"
                                disabled={loading}
                              >
                                <Check className="h-3 w-3" />
                                Check-in
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-green-600 px-3">
                                <Check className="h-3 w-3" />
                                Confirmado
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {filteredParticipants.length === 0 && !loading && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">
                          Nenhum participante encontrado
                        </h3>
                        <p className="text-muted-foreground">
                          {participants.length === 0 
                            ? "Este evento ainda não possui participantes inscritos."
                            : "Tente ajustar os filtros ou termos de busca."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Footer com informações do evento */}
          <div className="border-t pt-4 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>
                Evento: {event.name} | {formatDate(event.date)}
              </span>
              <span>
                Vagas: {event.filledSpots}/{event.totalSpots}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}