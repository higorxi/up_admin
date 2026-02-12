"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { BenefitFormModal } from "@/components/benefit-form-modal"
import { RedemptionsModal } from "@/components/redemptions-modal"
import { CardSkeleton } from "@/components/card-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, Gift, Loader2, AlertCircle } from "lucide-react"
import { useBenefits } from "@/hooks/use-benefits"
import type { Benefit, CreateBenefitData, UpdateBenefitData } from "@/lib/services/benefits"
import { BenefitCard } from "@/components/benefit-card"

export default function BenefitsPage() {
  const { 
    benefits, 
    loading, 
    error: hookError, 
    refetch,
    create,
    update,
    deleteBenefit,
    toggleStatus 
  } = useBenefits()

  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isRedemptionsModalOpen, setIsRedemptionsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleCreate = () => {
    setSelectedBenefit(null)
    setFormMode("create")
    setIsFormModalOpen(true)
    setActionError(null)
  }

  const handleEdit = (benefit: Benefit) => {
    setSelectedBenefit(benefit)
    setFormMode("edit")
    setIsFormModalOpen(true)
    setActionError(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este benefício?")) {
      return
    }

    try {
      setActionLoading(true)
      setActionError(null)
      await deleteBenefit(id)
    } catch (err: any) {
      setActionError(err.message || "Erro ao excluir benefício")
      console.error("Error deleting benefit:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      setActionLoading(true)
      setActionError(null)
      await toggleStatus(id)
    } catch (err: any) {
      setActionError(err.message || "Erro ao alterar status do benefício")
      console.error("Error toggling benefit status:", err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleViewRedemptions = (benefit: Benefit) => {
    setSelectedBenefit(benefit)
    setIsRedemptionsModalOpen(true)
  }

  const handleSave = async (benefitData: CreateBenefitData | UpdateBenefitData) => {
    try {
      if (formMode === "create") {
        await create(benefitData as CreateBenefitData)
      } else if (selectedBenefit) {
        await update(selectedBenefit.id, benefitData as UpdateBenefitData)
      }
      setIsFormModalOpen(false)
    } catch (err) {
      throw err // O erro será tratado pelo modal
    }
  }

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (benefit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && benefit.isActive) ||
      (statusFilter === "inactive" && !benefit.isActive) ||
      (statusFilter === "low-stock" && 
        benefit.quantity !== undefined && 
        benefit.quantity !== null &&
        (benefit.quantity - (benefit.activeRedemptions || 0)) <= benefit.quantity * 0.1) ||
      (statusFilter === "expiring" &&
        benefit.expiresAt &&
        new Date(benefit.expiresAt).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000)

    return matchesSearch && matchesStatus
  })

  const activeCount = benefits.filter((b) => b.isActive).length
  const inactiveCount = benefits.filter((b) => !b.isActive).length
  const totalRedemptions = benefits.reduce((acc, b) => acc + (b._count?.redemptions || 0), 0)
  const lowStockCount = benefits.filter((b) => {
    if (!b.quantity) return false
    const available = b.quantity - (b.activeRedemptions || 0)
    return available <= b.quantity * 0.1
  }).length

  // Auto-dismiss action error after 5 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [actionError])

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Benefícios e Resgates"
        description="Gerencie benefícios disponíveis e acompanhe resgates"
        actions={
          <Button 
            size="sm" 
            onClick={handleCreate} 
            disabled={actionLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Benefício
          </Button>
        }
      >
        {hookError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{hookError}</AlertDescription>
          </Alert>
        )}

        {actionError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Benefícios</p>
                <p className="text-2xl font-bold text-card-foreground">{benefits.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-card-foreground">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Resgates</p>
                <p className="text-2xl font-bold text-card-foreground">{totalRedemptions}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-2xl font-bold text-card-foreground">{lowStockCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="low-stock">Estoque Baixo</SelectItem>
              <SelectItem value="expiring">Expirando</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-muted-foreground border-border/50 bg-muted/30 font-medium">
            {filteredBenefits.length} benefício{filteredBenefits.length !== 1 ? "s" : ""} encontrado
            {filteredBenefits.length !== 1 ? "s" : ""}
          </Badge>
          {statusFilter !== "all" && (
            <Badge variant="outline" className="border-secondary/50 bg-secondary/5 text-secondary font-medium">
              Status:{" "}
              {statusFilter === "active"
                ? "Ativos"
                : statusFilter === "inactive"
                  ? "Inativos"
                  : statusFilter === "low-stock"
                    ? "Estoque Baixo"
                    : "Expirando"}
            </Badge>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <CardSkeleton count={6} />
          ) : (
            filteredBenefits.map((benefit) => (
              <BenefitCard
                key={benefit.id}
                benefit={benefit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onViewRedemptions={handleViewRedemptions}
                disabled={actionLoading}
              />
            ))
          )}
        </div>

        {!loading && filteredBenefits.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum benefício encontrado</h3>
            <p className="text-muted-foreground">
              {benefits.length === 0 
                ? "Comece criando seu primeiro benefício."
                : "Tente ajustar os filtros ou termos de busca."
              }
            </p>
          </div>
        )}

        {/* Modals */}
        <BenefitFormModal
          benefit={selectedBenefit}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSave}
          mode={formMode}
        />

        <RedemptionsModal
          benefit={selectedBenefit}
          isOpen={isRedemptionsModalOpen}
          onClose={() => setIsRedemptionsModalOpen(false)}
        />
      </AdminPageLayout>
    </AdminLayout>
  )
}