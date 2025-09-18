"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, X, Mail, Phone, MapPin, Calendar, Building, ExternalLink, FileText, MessageSquare } from "lucide-react"
import { useState } from "react"

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  company: string
  category: string
  location: string
  registrationDate: string
  status: "pending" | "approved" | "rejected"
  description: string
  experience: string
  portfolio?: string
}

interface SupplierDetailsModalProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, reason: string) => Promise<void>
}

export function SupplierDetailsModal({ supplier, isOpen, onClose, onApprove, onReject }: SupplierDetailsModalProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!supplier) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Aprovado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejeitado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await onApprove(supplier.id)
      onClose()
    } catch (error) {
      console.error("Erro ao aprovar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Por favor, informe o motivo da rejeição")
      return
    }

    setIsLoading(true)
    try {
      await onReject(supplier.id, rejectionReason)
      onClose()
      setShowRejectionForm(false)
      setRejectionReason("")
    } catch (error) {
      console.error("Erro ao rejeitar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {supplier.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xl">{supplier.name}</span>
                {getStatusBadge(supplier.status)}
              </div>
              <p className="text-sm text-muted-foreground font-normal">{supplier.category}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Contact Information */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-card-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Informações de Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded md:col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Cadastrado em {supplier.registrationDate}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-3 text-card-foreground">Descrição dos Serviços</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground leading-relaxed">{supplier.description}</p>
              </div>
            </div>

            <Separator />

            {/* Experience */}
            <div>
              <h3 className="font-semibold mb-3 text-card-foreground">Experiência Profissional</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground leading-relaxed">{supplier.experience}</p>
              </div>
            </div>

            {supplier.portfolio && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 text-card-foreground">Portfólio</h3>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ExternalLink className="h-4 w-4" />
                    Ver Portfólio
                  </Button>
                </div>
              </>
            )}

            <Separator />

            {/* Documents */}
            <div>
              <h3 className="font-semibold mb-3 text-card-foreground">Documentos</h3>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Certificados
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Documentos Legais
                </Button>
              </div>
            </div>

            {showRejectionForm && (
              <>
                <Separator />
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <Label htmlFor="rejection-reason" className="text-sm font-medium text-red-700 dark:text-red-300">
                    Motivo da Rejeição *
                  </Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Descreva o motivo da rejeição do fornecedor..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {supplier.status === "pending" && (
          <div className="flex gap-3 pt-4 border-t">
            {!showRejectionForm ? (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isLoading ? "Aprovando..." : "Aprovar Fornecedor"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectionForm(true)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeitar Fornecedor
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionForm(false)
                    setRejectionReason("")
                  }}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isLoading || !rejectionReason.trim()}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isLoading ? "Rejeitando..." : "Confirmar Rejeição"}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
