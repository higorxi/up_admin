"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { SupplierCard } from "@/components/supplier-card"
import { SupplierDetailsModal } from "@/components/supplier-details-modal"
import { RejectSupplierDialog } from "@/components/reject-supplier-dialog"
import { GrantTrialDialog } from "@/components/grant-trial-dialog"
import { DeleteSupplierDialog } from "@/components/delete-supplier-dialog"
import { SupplierStoreManagerDialog } from "@/components/supplier-store-manager-dialog"
import { CardSkeleton } from "@/components/card-skeleton"
import { AdminDialog } from "@/components/admin-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarDays, Package, Search, Store, UserCheck, AlertCircle, RefreshCw, Edit } from "lucide-react"
import { useSuppliers } from "@/hooks/use-suppliers"
import { toast } from "@/hooks/use-toast"
import { getSupplierPlanType, type GrantTrialPayload, TrialDurationUnit, PlanType, type UpdateSupplierPayload } from "@/lib/services/suppliers"

export default function SuppliersPage() {
  const { suppliers, loading, error, refetch, approve, updateSupplier, reject, grantTrial, cancelTrial, deleteSupplier } =
    useSuppliers()

  const [selectedSupplier, setSelectedSupplier] = useState<(typeof suppliers)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [supplierToEdit, setSupplierToEdit] = useState<(typeof suppliers)[0] | null>(null)
  const [supplierToManageStore, setSupplierToManageStore] = useState<(typeof suppliers)[0] | null>(null)
  const [editPayload, setEditPayload] = useState<UpdateSupplierPayload>({})
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [supplierToReject, setSupplierToReject] = useState<{ id: string; name: string } | null>(null)
  const [isGrantTrialDialogOpen, setIsGrantTrialDialogOpen] = useState(false)
  const [supplierToGrantTrial, setSupplierToGrantTrial] = useState<{ id: string; name: string } | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<{ id: string; name: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleApprove = async (id: string) => {
    try {
      await approve(id)
      toast({
        title: "Lojista Parceiro aprovado",
        description: "O lojista parceiro foi aprovado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o lojista parceiro. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (supplier: (typeof suppliers)[0]) => {
    setSupplierToEdit(supplier)
    setEditPayload({
      tradeName: supplier.tradeName,
      companyName: supplier.companyName,
      document: supplier.document,
      stateRegistration: supplier.stateRegistration ?? "",
      contact: supplier.contact ?? "",
      type: supplier.type as UpdateSupplierPayload["type"],
    })
  }

  const handleEditConfirm = async () => {
    if (!supplierToEdit) return

    try {
      await updateSupplier(supplierToEdit.id, editPayload)
      toast({
        title: "Lojista atualizado",
        description: "Os dados cadastrais do lojista foram salvos com sucesso.",
      })
      setSupplierToEdit(null)
      setEditPayload({})
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o lojista parceiro.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleRejectClick = (id: string, name: string) => {
    setSupplierToReject({ id, name })
    setIsRejectDialogOpen(true)
  }

  const handleRejectConfirm = async (reason: string) => {
    if (!supplierToReject) return

    try {
      await reject(supplierToReject.id, reason)
      toast({
        title: "Lojista Parceiro rejeitado",
        description: "O lojista parceiro foi rejeitado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o lojista parceiro. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteClick = (id: string, name: string) => {
    setSupplierToDelete({ id, name })
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return

    try {
      await deleteSupplier(supplierToDelete.id)
      await refetch()
      toast({
        title: "Lojista Parceiro desativado",
        description: "O lojista parceiro foi desativado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao desativar",
        description: "Não foi possível desativar o lojista parceiro. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleGrantTrialClick = (supplier: (typeof suppliers)[0]) => {
    setSupplierToGrantTrial({ id: supplier.id, name: supplier.tradeName })
    setIsGrantTrialDialogOpen(true)
  }

  const formatTrialUnitLabel = (unit: TrialDurationUnit) => {
    const unitLabels: Record<TrialDurationUnit, string> = {
      days: "dia(s)",
      weeks: "semana(s)",
      months: "mês(es)",
    }

    return unitLabels[unit]
  }

  const formatPlanLabel = (planType: PlanType) => {
    const planLabels: Record<PlanType, string> = {
      SILVER: "Silver",
      GOLD: "Gold",
      PREMIUM: "Premium",
    }

    return planLabels[planType]
  }

  const handleGrantTrialConfirm = async (payload: GrantTrialPayload) => {
    if (!supplierToGrantTrial) return

    try {
      await grantTrial(supplierToGrantTrial.id, payload)
      await refetch()

      toast({
        title: "Trial concedido",
        description: `${payload.duration} ${formatTrialUnitLabel(payload.unit)} no plano ${formatPlanLabel(payload.planType)}.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao conceder trial",
        description: error instanceof Error ? error.message : "Não foi possível conceder o período de trial. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleCancelTrial = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar o trial deste lojista parceiro?")) return

    try {
      await cancelTrial(id)
      await refetch()

      toast({
        title: "Trial cancelado",
        description: "O trial manual foi cancelado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao cancelar trial",
        description: error instanceof Error ? error.message : "Não foi possível cancelar o período de trial. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleViewDetails = (supplier: (typeof suppliers)[0]) => {
    setSelectedSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleStoreManagerChanged = async () => {
    await refetch()
  }

  const filteredSuppliers = suppliers
    .filter((supplier) => {
      const matchesSearch =
        supplier.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.store?.name && supplier.store.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && supplier.status === "PENDING") ||
        (statusFilter === "approved" && supplier.status === "APPROVED") ||
        (statusFilter === "rejected" && supplier.status === "REJECTED")

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Ordenação por plano: PREMIUM -> GOLD -> SILVER -> SEM PLANO
      const planOrder: Record<string, number> = { PREMIUM: 1, GOLD: 2, SILVER: 3 }
      const planA = getSupplierPlanType(a) || "NONE"
      const planB = getSupplierPlanType(b) || "NONE"

      const planAOrder = planOrder[planA] || 4
      const planBOrder = planOrder[planB] || 4

      if (planAOrder !== planBOrder) {
        return planAOrder - planBOrder
      }

      // Ordenação por status: PENDING -> APPROVED -> REJECTED
      const statusOrder = { PENDING: 1, APPROVED: 2, REJECTED: 3 }
      const statusComparison = statusOrder[a.status] - statusOrder[b.status]
      
      if (statusComparison !== 0) {
        return statusComparison
      }
      
      // Ordenação alfabética dentro do mesmo status/plano
      return a.tradeName.localeCompare(b.tradeName, 'pt-BR', { sensitivity: 'base' })
    })

  const approvedCount = suppliers.filter((supplier) => supplier.status === "APPROVED").length
  const pendingCount = suppliers.filter((supplier) => supplier.status === "PENDING").length
  const storesCount = suppliers.filter((supplier) => supplier.store).length
  const productsCount = suppliers.reduce((total, supplier) => total + (supplier.store?.products?.length ?? supplier.store?._count?.products ?? 0), 0)
  const eventsCount = suppliers.reduce((total, supplier) => total + (supplier.store?.events?.length ?? supplier.store?._count?.events ?? 0), 0)

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Lojista Parceiro"
        description="Gerencie aprovações e cadastros de lojistas parceiros"
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

        <div className="grid gap-3 md:grid-cols-5">
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
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-xs text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-semibold">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Lojas</p>
                <p className="text-2xl font-semibold">{storesCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Produtos</p>
                <p className="text-2xl font-semibold">{productsCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Eventos</p>
                <p className="text-2xl font-semibold">{eventsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome comercial, empresa, documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-52 border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-muted-foreground border-border/50 bg-muted/30 font-medium">
            {filteredSuppliers.length} lojista parceiro{filteredSuppliers.length !== 1 ? "s" : ""} encontrado
            {filteredSuppliers.length !== 1 ? "s" : ""}
          </Badge>
          {statusFilter !== "all" && (
            <Badge variant="outline" className="border-primary/50 bg-primary/5 text-primary font-medium">
              Status:{" "}
              {statusFilter === "pending" ? "Pendente" : statusFilter === "approved" ? "Aprovado" : "Rejeitado"}
            </Badge>
          )}
        </div>

        {/* Suppliers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <CardSkeleton count={6} />
          ) : (
            filteredSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onApprove={handleApprove}
                onReject={() => handleRejectClick(supplier.id, supplier.tradeName)}
                onGrantTrial={handleGrantTrialClick}
                onCancelTrial={handleCancelTrial}
                onViewDetails={handleViewDetails}
                onEdit={handleEditClick}
                onManageStore={setSupplierToManageStore}
                onDelete={(id) => handleDeleteClick(id, supplier.tradeName)}
              />
            ))
          )}
        </div>

        {!loading && filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum lojista parceiro encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
          </div>
        )}

        {/* Modals */}
        <SupplierDetailsModal
          supplier={selectedSupplier}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          onReject={(id) => {
            const supplier = suppliers.find((s) => s.id === id)
            if (supplier) {
              handleRejectClick(id, supplier.tradeName)
            }
          }}
          onGrantTrial={handleGrantTrialClick}
          onCancelTrial={handleCancelTrial}
        />

        <RejectSupplierDialog
          isOpen={isRejectDialogOpen}
          onClose={() => {
            setIsRejectDialogOpen(false)
            setSupplierToReject(null)
          }}
          onConfirm={handleRejectConfirm}
          supplierName={supplierToReject?.name || ""}
        />

        <GrantTrialDialog
          isOpen={isGrantTrialDialogOpen}
          onClose={() => {
            setIsGrantTrialDialogOpen(false)
            setSupplierToGrantTrial(null)
          }}
          onConfirm={handleGrantTrialConfirm}
          supplierName={supplierToGrantTrial?.name || ""}
        />

        <DeleteSupplierDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false)
            setSupplierToDelete(null)
          }}
          onConfirm={handleDeleteConfirm}
          supplierName={supplierToDelete?.name || ""}
        />

        <SupplierStoreManagerDialog
          supplier={supplierToManageStore}
          isOpen={!!supplierToManageStore}
          onClose={() => setSupplierToManageStore(null)}
          onChanged={handleStoreManagerChanged}
        />

        <AdminDialog
          open={!!supplierToEdit}
          onOpenChange={(open) => !open && setSupplierToEdit(null)}
          title="Editar Lojista Parceiro"
          description="Atualize os dados cadastrais principais do parceiro."
          icon={<Edit className="h-6 w-6 flex-shrink-0" />}
          footer={
            <DialogFooter>
              <Button variant="outline" onClick={() => setSupplierToEdit(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditConfirm}>Salvar alterações</Button>
            </DialogFooter>
          }
        >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplier-trade-name">Nome comercial</Label>
                <Input
                  id="supplier-trade-name"
                  value={editPayload.tradeName ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, tradeName: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-company-name">Razão social</Label>
                <Input
                  id="supplier-company-name"
                  value={editPayload.companyName ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, companyName: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-document">Documento</Label>
                <Input
                  id="supplier-document"
                  value={editPayload.document ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, document: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-state-registration">Inscrição estadual</Label>
                <Input
                  id="supplier-state-registration"
                  value={editPayload.stateRegistration ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, stateRegistration: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-contact">Contato</Label>
                <Input
                  id="supplier-contact"
                  value={editPayload.contact ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, contact: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={editPayload.type ?? "SUPPLIER"}
                  onValueChange={(value) =>
                    setEditPayload((prev) => ({ ...prev, type: value as UpdateSupplierPayload["type"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPPLIER">Fornecedor</SelectItem>
                    <SelectItem value="WELLNESS">Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </AdminDialog>
      </AdminPageLayout>
    </AdminLayout>
  )
}
