"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Mail, Phone, MapPin, Calendar, Building, FileText, Store, Globe, Clock } from "lucide-react"
import { useState } from "react"
import type { Supplier } from "@/lib/services/suppliers"

interface SupplierDetailsModalProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string) => Promise<void>
}

export function SupplierDetailsModal({ supplier, isOpen, onClose, onApprove }: SupplierDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!supplier) return null

  const getStatusBadge = () => {
    switch (supplier.status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Aprovado
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejeitado
          </Badge>
        )
      default:
        return null
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {supplier.tradeName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xl">{supplier.tradeName}</span>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-muted-foreground font-normal">{supplier.companyName}</p>
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
                  <span>{supplier.contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.companyName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>CNPJ: {supplier.document}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded md:col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Cadastrado em {formatDate(supplier.createdAt)}</span>
                </div>
                {supplier.updatedAt && (
                  <div className="flex items-center gap-2 text-sm p-2 bg-background rounded md:col-span-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Última atualização em {formatDate(supplier.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Store Information */}
            {supplier.store && (
              <>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-card-foreground flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Informações da Loja
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.store.name}</span>
                    </div>
                    {supplier.store.address && (
                      <>
                        <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {supplier.store.address.street}, {supplier.store.address.city} -{" "}
                            {supplier.store.address.state}
                          </span>
                        </div>
                        {supplier.store.address.zipCode && (
                          <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>CEP: {supplier.store.address.zipCode}</span>
                          </div>
                        )}
                        {supplier.store.address.neighborhood && (
                          <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>Bairro: {supplier.store.address.neighborhood}</span>
                          </div>
                        )}
                      </>
                    )}
                    {supplier.store.phone && (
                      <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.store.phone}</span>
                      </div>
                    )}
                    {supplier.store.email && (
                      <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.store.email}</span>
                      </div>
                    )}
                    {supplier.store.website && (
                      <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.store.website}</span>
                      </div>
                    )}
                  </div>
                  {supplier.store.description && (
                    <div className="mt-4 p-3 bg-background rounded">
                      <h4 className="font-medium mb-2">Descrição da Loja</h4>
                      <p className="text-sm text-muted-foreground">{supplier.store.description}</p>
                    </div>
                  )}
                </div>
                <Separator />
              </>
            )}

            {/* Additional Information */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-card-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informações Adicionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <span className="font-medium">ID:</span>
                  <span className="text-muted-foreground">{supplier.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-background rounded">
                  <span className="font-medium">Status de Acesso:</span>
                  <span
                    className={
                      supplier.status === "PENDING"
                        ? "text-yellow-600"
                        : supplier.status === "APPROVED"
                          ? "text-green-600"
                          : "text-red-600"
                    }
                  >
                    {supplier.status === "PENDING" ? "Pendente" : supplier.status === "APPROVED" ? "Aprovado" : "Rejeitado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {supplier.status === "PENDING" && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              {isLoading ? "Aprovando..." : "Aprovar Fornecedor"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
