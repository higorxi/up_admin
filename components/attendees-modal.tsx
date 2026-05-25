"use client"

import { useEffect, useState } from "react"
import { AdminDialog } from "@/components/admin-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Check, Mail, RefreshCw, Search, Users } from "lucide-react"
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

export function AttendeesModal({ event, isOpen, onClose, onCheckIn, getParticipants }: AttendeesModalProps) {
  const [participants, setParticipants] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (isOpen && event?.id) {
      loadParticipants()
    } else {
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  if (!event) return null

  const filteredParticipants = participants.filter((participant) => {
    const professional = participant.professional
    if (!professional) return false

    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (professional.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      professional.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "checked-in" && participant.checkedIn) ||
      (activeTab === "not-checked-in" && !participant.checkedIn)

    return matchesSearch && matchesTab
  })

  const checkedInCount = participants.filter((participant) => participant.checkedIn).length
  const notCheckedInCount = participants.filter((participant) => !participant.checkedIn).length

  return (
    <AdminDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Visualizar Participantes"
      description={`${event.name} • ${participants.length} inscrito(s)`}
      icon={<Users className="h-6 w-6 flex-shrink-0" />}
      footer={
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Evento: {event.name} | {formatDate(event.date)}
          </span>
          <span>
            Vagas: {event.filledSpots}/{event.totalSpots}
          </span>
        </div>
      }
    >
      <div className="flex h-full flex-col space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-xl font-bold text-card-foreground">{participants.length}</div>
            <div className="text-xs text-muted-foreground">Total Inscritos</div>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <div className="text-xl font-bold text-green-600">{checkedInCount}</div>
            <div className="text-xs text-muted-foreground">Check-in Feito</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-3 text-center">
            <div className="text-xl font-bold text-yellow-600">{notCheckedInCount}</div>
            <div className="text-xs text-muted-foreground">Pendente</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button variant="outline" size="sm" onClick={loadParticipants} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
          <TabsList className="mb-3 grid w-full grid-cols-3">
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
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/25"
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                            {getInitials(professional.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="truncate text-sm font-medium text-card-foreground">{professional.name}</h4>
                            {participant.checkedIn ? (
                              <Badge variant="outline" className="border-green-600 text-xs text-green-600">
                                Check-in Feito
                                {participant.checkedInAt && (
                                  <span className="ml-1">{formatDateTime(participant.checkedInAt)}</span>
                                )}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-yellow-600 text-xs text-yellow-600">
                                Pendente
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground lg:grid-cols-2">
                            <div className="flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate">{professional.phone || professional.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span>Inscrito em {formatDate(participant.registeredAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          {!participant.checkedIn ? (
                            <Button
                              size="sm"
                              onClick={() => handleCheckIn(professional.id)}
                              className="gap-1 px-3 text-xs"
                              disabled={loading}
                            >
                              <Check className="h-3 w-3" />
                              Check-in
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1 px-3 text-xs text-green-600">
                              <Check className="h-3 w-3" />
                              Confirmado
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {filteredParticipants.length === 0 && !loading && (
                    <div className="py-8 text-center">
                      <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold text-card-foreground">Nenhum participante encontrado</h3>
                      <p className="text-muted-foreground">
                        {participants.length === 0
                          ? "Este evento ainda não possui participantes inscritos."
                          : "Tente ajustar os filtros ou termos de busca."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminDialog>
  )
}
