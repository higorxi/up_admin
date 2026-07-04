"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { RejectSupplierDialog } from "@/components/reject-supplier-dialog"
import { DeleteSupplierDialog } from "@/components/delete-supplier-dialog"
import { CardSkeleton } from "@/components/card-skeleton"
import { AdminDialog } from "@/components/admin-dialog"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  Check,
  Clock,
  Edit,
  Fingerprint,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UserCheck,
  X,
} from "lucide-react"
import { useWellness } from "@/hooks/use-wellness"
import { toast } from "@/hooks/use-toast"
import type { UpdateWellnessPayload, Wellness } from "@/lib/services/wellness"

const formatPrice = (price?: number | null) =>
  price != null
    ? price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "Sob consulta"

function statusBadge(status: Wellness["status"]) {
  switch (status) {
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
  }
}

export function WellnessAdminPage() {
  const { wellnessList, loading, error, refetch, approve, reject, deleteWellness, updateWellness } = useWellness()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [toReject, setToReject] = useState<{ id: string; name: string } | null>(null)
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null)
  const [toEdit, setToEdit] = useState<Wellness | null>(null)
  const [editPayload, setEditPayload] = useState<UpdateWellnessPayload>({})

  const filtered = wellnessList.filter((w) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      !term ||
      w.name.toLowerCase().includes(term) ||
      w.document.includes(term) ||
      (w.user?.email ?? "").toLowerCase().includes(term)
    const matchesStatus = statusFilter === "all" || w.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const approvedCount = wellnessList.filter((w) => w.status === "APPROVED").length
  const pendingCount = wellnessList.filter((w) => w.status === "PENDING").length

  const handleApprove = async (id: string) => {
    try {
      await approve(id)
      toast({
        title: "Parceiro Wellness aprovado",
        description: "O parceiro wellness foi aprovado com sucesso.",
      })
    } catch {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o parceiro wellness. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleRejectConfirm = async (reason: string) => {
    if (!toReject) return
    try {
      await reject(toReject.id, reason)
      toast({
        title: "Parceiro Wellness rejeitado",
        description: "O parceiro wellness foi rejeitado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o parceiro wellness. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEditClick = (wellness: Wellness) => {
    setToEdit(wellness)
    setEditPayload({
      name: wellness.name,
      document: wellness.document,
      contact: wellness.contact ?? "",
      description: wellness.description ?? "",
      whatsappMessage: wellness.whatsappMessage ?? "",
      openingHours: wellness.openingHours ?? "",
    })
  }

  const handleEditConfirm = async () => {
    if (!toEdit) return
    try {
      await updateWellness(toEdit.id, editPayload)
      toast({
        title: "Wellness atualizado",
        description: "Os dados cadastrais do parceiro wellness foram salvos com sucesso.",
      })
      setToEdit(null)
      setEditPayload({})
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o parceiro wellness.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!toDelete) return
    try {
      await deleteWellness(toDelete.id)
      toast({
        title: "Parceiro Wellness desativado",
        description: "O parceiro wellness foi desativado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao desativar",
        description: "Não foi possível desativar o parceiro wellness. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Parceiros Wellness"
        description="Gerencie aprovações e cadastros de parceiros wellness (perfil simples: nome, CPF e serviços — sem plano)"
      >
        {error && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={refetch} className="transition-colors">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-semibold">{approvedCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-semibold">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{wellnessList.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="PENDING">Pendentes</SelectItem>
              <SelectItem value="APPROVED">Aprovados</SelectItem>
              <SelectItem value="REJECTED">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-10">
              Nenhum parceiro wellness encontrado
            </p>
          ) : (
            filtered.map((wellness) => (
              <Card key={wellness.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      {wellness.user?.profileImage ? (
                        <AvatarImage src={wellness.user.profileImage} alt={wellness.name} />
                      ) : (
                        <AvatarFallback>
                          {wellness.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{wellness.name}</p>
                      {statusBadge(wellness.status)}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>CPF: {wellness.document}</span>
                    </div>
                    {wellness.contact && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{wellness.contact}</span>
                      </div>
                    )}
                    {wellness.user?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{wellness.user.email}</span>
                      </div>
                    )}
                    {wellness.user?.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                          {wellness.user.address.city ?? "--"}, {wellness.user.address.state ?? "--"}
                        </span>
                      </div>
                    )}
                  </div>

                  {wellness.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {wellness.services.slice(0, 3).map((service) => (
                        <Badge key={service.id} variant="secondary" className="text-[10px]">
                          {service.name} · {formatPrice(service.price)}
                        </Badge>
                      ))}
                      {wellness.services.length > 3 && (
                        <Badge variant="secondary" className="text-[10px]">
                          +{wellness.services.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    {wellness.status === "PENDING" && (
                      <>
                        <Button size="sm" className="flex-1" onClick={() => handleApprove(wellness.id)}>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setToReject({ id: wellness.id, name: wellness.name })}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(wellness)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setToDelete({ id: wellness.id, name: wellness.name })}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <AdminDialog
          open={!!toEdit}
          onOpenChange={(open) => !open && setToEdit(null)}
          title="Editar Parceiro Wellness"
          description="Atualize os dados do negócio."
          icon={<Edit className="h-6 w-6 flex-shrink-0" />}
          footer={
            <DialogFooter>
              <Button variant="outline" onClick={() => setToEdit(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditConfirm}>Salvar alterações</Button>
            </DialogFooter>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wellness-name">Nome do negócio</Label>
              <Input
                id="wellness-name"
                value={editPayload.name ?? ""}
                onChange={(event) => setEditPayload((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wellness-document">CPF do responsável</Label>
              <Input
                id="wellness-document"
                value={editPayload.document ?? ""}
                onChange={(event) => setEditPayload((prev) => ({ ...prev, document: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wellness-contact">Contato (WhatsApp)</Label>
              <Input
                id="wellness-contact"
                value={editPayload.contact ?? ""}
                onChange={(event) => setEditPayload((prev) => ({ ...prev, contact: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wellness-wa-message">Mensagem do WhatsApp</Label>
              <Input
                id="wellness-wa-message"
                value={editPayload.whatsappMessage ?? ""}
                onChange={(event) => setEditPayload((prev) => ({ ...prev, whatsappMessage: event.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="wellness-opening-hours">Horário de atendimento</Label>
              <Input
                id="wellness-opening-hours"
                placeholder="Ex: Segunda a sexta: 08:00 - 18:00 | Sábado: 08:00 - 12:00"
                value={editPayload.openingHours ?? ""}
                onChange={(event) => setEditPayload((prev) => ({ ...prev, openingHours: event.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="wellness-description">Descrição do negócio</Label>
              <Textarea
                id="wellness-description"
                value={editPayload.description ?? ""}
                onChange={(event) => setEditPayload((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
          </div>
        </AdminDialog>

        <RejectSupplierDialog
          isOpen={!!toReject}
          onClose={() => setToReject(null)}
          onConfirm={handleRejectConfirm}
          supplierName={toReject?.name ?? ""}
        />

        <DeleteSupplierDialog
          isOpen={!!toDelete}
          onClose={() => setToDelete(null)}
          onConfirm={handleDeleteConfirm}
          supplierName={toDelete?.name ?? ""}
        />
      </AdminPageLayout>
    </AdminLayout>
  )
}
