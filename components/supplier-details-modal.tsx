"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Mail, Phone, MapPin, Calendar, Building, FileText, Store, Globe, Clock, X, User } from "lucide-react"
import { useState } from "react"
import type { Supplier } from "@/lib/services/suppliers"

interface SupplierDetailsModalProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => void
}

export function SupplierDetailsModal({ supplier, isOpen, onClose, onApprove, onReject }: SupplierDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!supplier) return null

  const getStatusBadge = () => {
    switch (supplier.status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-500 bg-yellow-50 font-medium">
            Pendente
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="text-green-700 border-green-500 bg-green-50 font-medium">
            Aprovado
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-red-700 border-red-500 bg-red-50 font-medium">
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
            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
              <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                Informações da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{supplier.companyName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">CNPJ: {supplier.document}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{supplier.contact}</span>
                </div>
                {supplier.stateRegistration && (
                  <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">IE: {supplier.stateRegistration}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50 md:col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>Cadastrado em {formatDate(supplier.createdAt)}</span>
                </div>
                {supplier.updatedAt && (
                  <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50 md:col-span-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>Última atualização em {formatDate(supplier.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* User Information */}
            {supplier.user && (
              <>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    Informações do Usuário
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border/50">
                      <Avatar className="h-16 w-16">
                        {supplier.user.profileImage ? (
                          <AvatarImage src={supplier.user.profileImage} alt="Imagem de perfil" />
                        ) : null}
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {supplier.user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 text-sm mb-2">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{supplier.user.email}</span>
                        </div>
                      </div>
                    </div>
                    {supplier.user.address && (
                      <div className="p-4 bg-background rounded-lg border border-border/50">
                        <h4 className="font-medium mb-3 text-card-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          Endereço do Usuário
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Rua:</span>
                            <span className="font-medium">{supplier.user.address.street}{supplier.user.address.number ? `, ${supplier.user.address.number}` : ''}</span>
                          </div>
                          {supplier.user.address.complement && (
                            <div className="flex flex-col gap-1">
                              <span className="text-muted-foreground">Complemento:</span>
                              <span className="font-medium">{supplier.user.address.complement}</span>
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Bairro:</span>
                            <span className="font-medium">{supplier.user.address.district}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Cidade/Estado:</span>
                            <span className="font-medium">{supplier.user.address.city} - {supplier.user.address.state}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">CEP:</span>
                            <span className="font-medium">{supplier.user.address.zipCode}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}


            {/* Store Information */}
            {supplier.store && (
              <>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Store className="h-4 w-4 text-primary" />
                    </div>
                    Informações da Loja
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                      <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{supplier.store.name}</span>
                    </div>
                    {supplier.store.address && (
                      <>
                        <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50 md:col-span-2">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">
                            {supplier.store.address.street}, {supplier.store.address.city} -{" "}
                            {supplier.store.address.state}
                          </span>
                        </div>
                        {supplier.store.address.zipCode && (
                          <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>CEP: {supplier.store.address.zipCode}</span>
                          </div>
                        )}
                        {supplier.store.address.neighborhood && (
                          <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>Bairro: {supplier.store.address.neighborhood}</span>
                          </div>
                        )}
                      </>
                    )}
                    {supplier.store.phone && (
                      <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{supplier.store.phone}</span>
                      </div>
                    )}
                    {supplier.store.email && (
                      <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{supplier.store.email}</span>
                      </div>
                    )}
                    {supplier.store.website && (
                      <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                        <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{supplier.store.website}</span>
                      </div>
                    )}
                  </div>
                  {supplier.store.description && (
                    <div className="mt-4 p-4 bg-background rounded-lg border border-border/50">
                      <h4 className="font-medium mb-2 text-card-foreground">Descrição da Loja</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{supplier.store.description}</p>
                    </div>
                  )}
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Additional Information */}
            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
              <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                Informações Adicionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                  <span className="font-medium">ID:</span>
                  <span className="text-muted-foreground truncate">{supplier.id}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-background rounded-lg border border-border/50">
                  <span className="font-medium">Status de Acesso:</span>
                  <span
                    className={
                      supplier.status === "PENDING"
                        ? "text-yellow-700 font-medium"
                        : supplier.status === "APPROVED"
                          ? "text-green-700 font-medium"
                          : "text-red-700 font-medium"
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
            <Button
              onClick={() => {
                onReject(supplier.id)
                onClose()
              }}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Rejeitar Fornecedor
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
