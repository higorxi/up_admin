"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { ProfessionalCard } from "@/components/professional-card"
import { ProfessionalFormModal } from "@/components/professional-form-modal"
import { ProfessionalDetailsModal } from "@/components/professional-details-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Download, Users, AlertCircle, RefreshCw } from "lucide-react"
import { useProfessionals } from "@/hooks/use-professionals"
import { toast } from "@/hooks/use-toast"
import type { Professional } from "@/lib/services/professionals"

export default function ProfessionalsPage() {
  const { professionals, loading, error, refetch, create, update, delete: deleteProfessional } = useProfessionals()

  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [searchTerm, setSearchTerm] = useState("")
  const [professionFilter, setProfessionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")

  const handleCreate = () => {
    setSelectedProfessional(null)
    setFormMode("create")
    setIsFormModalOpen(true)
  }

  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional)
    setFormMode("edit")
    setIsFormModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este profissional?")) {
      try {
        await deleteProfessional(id)
        toast({
          title: "Profissional excluído",
          description: "O profissional foi excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o profissional. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewDetails = (professional: Professional) => {
    setSelectedProfessional(professional)
    setIsDetailsModalOpen(true)
  }

  const handleSave = async (
    professionalData: Omit<
      Professional,
      "id" | "createdAt" | "updatedAt" | "address" | "socialMedia" | "availableDays"
    >,
  ) => {
    try {
      if (formMode === "create") {
        await create(professionalData)
        toast({
          title: "Profissional criado",
          description: "O profissional foi criado com sucesso.",
        })
      } else if (selectedProfessional) {
        await update(selectedProfessional.id, professionalData)
        toast({
          title: "Profissional atualizado",
          description: "O profissional foi atualizado com sucesso.",
        })
      }
      setIsFormModalOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o profissional. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.address?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProfession = professionFilter === "all" || professional.profession === professionFilter
    const matchesStatus =
      statusFilter === "all" || (statusFilter === "active" ? professional.isActive : !professional.isActive)
    const matchesCity = cityFilter === "all" || professional.address?.city === cityFilter

    return matchesSearch && matchesProfession && matchesStatus && matchesCity
  })

  const professions = [...new Set(professionals.map((p) => p.profession))]
  const cities = [...new Set(professionals.map((p) => p.address?.city).filter(Boolean))]

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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profissionais Recomendados</h1>
            <p className="text-muted-foreground">Gerencie profissionais recomendados da plataforma</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Profissional
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, profissão ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={professionFilter} onValueChange={setProfessionFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Profissão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Profissões</SelectItem>
              {professions.map((profession) => (
                <SelectItem key={profession} value={profession}>
                  {profession}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">
            {filteredProfessionals.length} profissional{filteredProfessionals.length !== 1 ? "is" : ""} encontrado
            {filteredProfessionals.length !== 1 ? "s" : ""}
          </Badge>
          {professionFilter !== "all" && (
            <Badge variant="outline" className="text-primary">
              Profissão: {professionFilter}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline" className="text-secondary">
              Status: {statusFilter === "active" ? "Ativo" : "Inativo"}
            </Badge>
          )}
          {cityFilter !== "all" && (
            <Badge variant="outline" className="text-accent">
              Cidade: {cityFilter}
            </Badge>
          )}
        </div>

        {/* Professionals Grid */}
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
            {filteredProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {!loading && filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum profissional encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
          </div>
        )}

        {/* Modals */}
        <ProfessionalFormModal
          professional={selectedProfessional}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSave}
          mode={formMode}
        />

        <ProfessionalDetailsModal
          professional={selectedProfessional}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      </div>
    </AdminLayout>
  )
}
