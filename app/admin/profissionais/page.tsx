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
import { Search, Plus, Download, Users } from "lucide-react"

interface Professional {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  location: string
  rating: number
  reviewsCount: number
  experience: string
  description: string
  portfolio?: string
  isActive: boolean
  featuredWork?: string
}

// Mock data for professionals
const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@decoradora.com",
    phone: "(11) 99999-9999",
    specialty: "Decoração de Interiores",
    location: "São Paulo, SP",
    rating: 4.8,
    reviewsCount: 127,
    experience: "8 anos",
    description:
      "Especialista em decoração de interiores com foco em ambientes residenciais modernos. Trabalho com conceitos de minimalismo e funcionalidade.",
    portfolio: "https://ana-silva-design.com",
    isActive: true,
    featuredWork: "Apartamento de 120m² em Moema - Projeto completo de decoração",
  },
  {
    id: "2",
    name: "Carlos Mendes",
    email: "carlos@arquiteto.com",
    phone: "(21) 88888-8888",
    specialty: "Arquitetura",
    location: "Rio de Janeiro, RJ",
    rating: 4.9,
    reviewsCount: 89,
    experience: "12 anos",
    description:
      "Arquiteto especializado em projetos residenciais e comerciais sustentáveis. Membro do CAU-RJ com certificação em Green Building.",
    portfolio: "https://carlos-arquitetura.com",
    isActive: true,
    featuredWork: "Casa sustentável em Búzios - Projeto premiado",
  },
  {
    id: "3",
    name: "Marina Costa",
    email: "marina@paisagismo.com",
    phone: "(31) 77777-7777",
    specialty: "Paisagismo",
    location: "Belo Horizonte, MG",
    rating: 4.7,
    reviewsCount: 156,
    experience: "10 anos",
    description:
      "Paisagista com expertise em jardins residenciais e comerciais. Especialista em plantas nativas e projetos de baixa manutenção.",
    isActive: true,
    featuredWork: "Jardim vertical de 200m² em shopping center",
  },
  {
    id: "4",
    name: "Roberto Lima",
    email: "roberto@iluminacao.com",
    phone: "(85) 66666-6666",
    specialty: "Iluminação",
    location: "Fortaleza, CE",
    rating: 4.6,
    reviewsCount: 73,
    experience: "6 anos",
    description:
      "Especialista em projetos de iluminação residencial e comercial. Trabalho com LED e automação residencial para criar ambientes únicos.",
    isActive: false,
    featuredWork: "Sistema de iluminação inteligente para residência de alto padrão",
  },
  {
    id: "5",
    name: "Fernanda Oliveira",
    email: "fernanda@marcenaria.com",
    phone: "(47) 55555-5555",
    specialty: "Design de Móveis",
    location: "Joinville, SC",
    rating: 4.9,
    reviewsCount: 94,
    experience: "15 anos",
    description:
      "Designer de móveis especializada em peças sob medida e design contemporâneo. Trabalho com madeiras nobres e sustentáveis.",
    portfolio: "https://fernanda-moveis.com",
    isActive: true,
    featuredWork: "Linha de móveis sustentáveis para apartamento compacto",
  },
]

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [searchTerm, setSearchTerm] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

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

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este profissional?")) {
      setProfessionals((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleViewDetails = (professional: Professional) => {
    setSelectedProfessional(professional)
    setIsDetailsModalOpen(true)
  }

  const handleSave = (professionalData: Omit<Professional, "id" | "rating" | "reviewsCount">) => {
    if (formMode === "create") {
      const newProfessional: Professional = {
        ...professionalData,
        id: Date.now().toString(),
        rating: 0,
        reviewsCount: 0,
      }
      setProfessionals((prev) => [...prev, newProfessional])
    } else if (selectedProfessional) {
      setProfessionals((prev) =>
        prev.map((p) =>
          p.id === selectedProfessional.id
            ? {
                ...professionalData,
                id: selectedProfessional.id,
                rating: selectedProfessional.rating,
                reviewsCount: selectedProfessional.reviewsCount,
              }
            : p,
        ),
      )
    }
  }

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecialty = specialtyFilter === "all" || professional.specialty === specialtyFilter
    const matchesStatus =
      statusFilter === "all" || (statusFilter === "active" ? professional.isActive : !professional.isActive)
    const matchesLocation = locationFilter === "all" || professional.location === locationFilter

    return matchesSearch && matchesSpecialty && matchesStatus && matchesLocation
  })

  const activeCount = professionals.filter((p) => p.isActive).length
  const inactiveCount = professionals.filter((p) => !p.isActive).length
  const averageRating = professionals.reduce((acc, p) => acc + p.rating, 0) / professionals.length

  const specialties = [...new Set(professionals.map((p) => p.specialty))]
  const locations = [...new Set(professionals.map((p) => p.location))]

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profissionais Recomendados</h1>
            <p className="text-muted-foreground">Gerencie profissionais recomendados da plataforma</p>
          </div>
          {/* 
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Profissional
            </Button>
          </div>
          */}
        </div>

        {/* Stats 
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-card-foreground">{professionals.length}</p>
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
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativos</p>
                <p className="text-2xl font-bold text-card-foreground">{inactiveCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliação Média</p>
                <p className="text-2xl font-bold text-card-foreground">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
        */}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, especialidade ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Especialidades</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
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
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Localizações</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
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
          {specialtyFilter !== "all" && (
            <Badge variant="outline" className="text-primary">
              Especialidade: {specialtyFilter}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline" className="text-secondary">
              Status: {statusFilter === "active" ? "Ativo" : "Inativo"}
            </Badge>
          )}
          {locationFilter !== "all" && (
            <Badge variant="outline" className="text-accent">
              Local: {locationFilter}
            </Badge>
          )}
        </div>

        {/* Professionals Grid */}
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

        {filteredProfessionals.length === 0 && (
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
