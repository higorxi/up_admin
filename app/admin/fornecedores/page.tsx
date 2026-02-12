"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { SupplierCard } from "@/components/supplier-card"
import { SupplierDetailsModal } from "@/components/supplier-details-modal"
import { RejectSupplierDialog } from "@/components/reject-supplier-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Download, UserCheck, AlertCircle, RefreshCw } from "lucide-react"
import { useSuppliers } from "@/hooks/use-suppliers"
import { toast } from "@/hooks/use-toast"

export default function SuppliersPage() {
  const { suppliers, loading, error, refetch, approve, reject, deleteSupplier } = useSuppliers()

  const [selectedSupplier, setSelectedSupplier] = useState<(typeof suppliers)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [supplierToReject, setSupplierToReject] = useState<{ id: string; name: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleApprove = async (id: string) => {
    try {
      await approve(id)
      toast({
        title: "Fornecedor aprovado",
        description: "O fornecedor foi aprovado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o fornecedor. Tente novamente.",
        variant: "destructive",
      })
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
        title: "Fornecedor rejeitado",
        description: "O fornecedor foi rejeitado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o fornecedor. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      try {
        await deleteSupplier(id)
        toast({
          title: "Fornecedor excluído",
          description: "O fornecedor foi excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o fornecedor. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewDetails = (supplier: (typeof suppliers)[0]) => {
    setSelectedSupplier(supplier)
    setIsModalOpen(true)
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
      // Ordenação por status: PENDING -> APPROVED -> REJECTED
      const statusOrder = { PENDING: 1, APPROVED: 2, REJECTED: 3 }
      const statusComparison = statusOrder[a.status] - statusOrder[b.status]
      
      if (statusComparison !== 0) {
        return statusComparison
      }
      
      // Ordenação alfabética dentro do mesmo status
      return a.tradeName.localeCompare(b.tradeName, 'pt-BR', { sensitivity: 'base' })
    })

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Fornecedores Parceiros</h1>
            <p className="text-muted-foreground">Gerencie aprovações e cadastros de fornecedores</p>
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
            {filteredSuppliers.length} fornecedor{filteredSuppliers.length !== 1 ? "es" : ""} encontrado
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
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onApprove={handleApprove}
                onReject={() => handleRejectClick(supplier.id, supplier.tradeName)}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!loading && filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum fornecedor encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
          </div>
        )}

        {/* Details Modal */}
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
        />

        {/* Reject Dialog */}
        <RejectSupplierDialog
          isOpen={isRejectDialogOpen}
          onClose={() => {
            setIsRejectDialogOpen(false)
            setSupplierToReject(null)
          }}
          onConfirm={handleRejectConfirm}
          supplierName={supplierToReject?.name || ""}
        />
      </div>
    </AdminLayout>
  )
}
