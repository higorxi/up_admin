"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { BenefitCard } from "@/components/benefit-card"
import { BenefitFormModal } from "@/components/benefit-form-modal"
import { RedemptionsModal } from "@/components/redemptions-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download, Gift } from "lucide-react"

interface Benefit {
  id: string
  title: string
  description: string
  category: string
  pointsCost: number
  totalQuantity: number
  availableQuantity: number
  redeemedCount: number
  isActive: boolean
  expiryDate?: string
  imageUrl?: string
  provider: string
  terms: string
}

// Mock data for benefits
const mockBenefits: Benefit[] = [
  {
    id: "1",
    title: "20% de Desconto em Móveis Planejados",
    description:
      "Desconto especial de 20% em móveis planejados para cozinha, quarto e sala. Válido para projetos acima de R$ 5.000.",
    category: "Desconto em Produtos",
    pointsCost: 500,
    totalQuantity: 100,
    availableQuantity: 75,
    redeemedCount: 25,
    isActive: true,
    expiryDate: "2024-12-31",
    provider: "Móveis & Design",
    terms:
      "Válido apenas para novos projetos. Não cumulativo com outras promoções. Prazo de validade: 30 dias após o resgate.",
  },
  {
    id: "2",
    title: "Consultoria de Decoração Gratuita",
    description:
      "Sessão de consultoria de decoração de 2 horas com profissional especializado. Inclui análise do ambiente e sugestões personalizadas.",
    category: "Consultoria Gratuita",
    pointsCost: 800,
    totalQuantity: 50,
    availableQuantity: 32,
    redeemedCount: 18,
    isActive: true,
    expiryDate: "2024-11-30",
    provider: "Studio Decoração",
    terms: "Agendamento com antecedência mínima de 7 dias. Válido para região metropolitana de São Paulo.",
  },
  {
    id: "3",
    title: "E-book: Guia Completo de Iluminação",
    description:
      "E-book exclusivo com 150 páginas sobre técnicas de iluminação residencial e comercial. Inclui projetos práticos e dicas profissionais.",
    category: "E-book",
    pointsCost: 200,
    totalQuantity: 500,
    availableQuantity: 423,
    redeemedCount: 77,
    isActive: true,
    provider: "Editora Design",
    terms: "Download imediato após confirmação do resgate. Arquivo em PDF com proteção contra cópia.",
  },
  {
    id: "4",
    title: "Frete Grátis em Compras Online",
    description:
      "Frete gratuito para compras online em nossa loja virtual. Válido para todo o Brasil, sem valor mínimo.",
    category: "Frete Grátis",
    pointsCost: 150,
    totalQuantity: 200,
    availableQuantity: 156,
    redeemedCount: 44,
    isActive: true,
    expiryDate: "2024-10-31",
    provider: "Loja Virtual Decor",
    terms: "Válido para uma compra. Código deve ser inserido no checkout. Não válido para produtos em promoção.",
  },
  {
    id: "5",
    title: "Curso Online: Feng Shui Básico",
    description: "Curso online completo de Feng Shui com 20 horas de conteúdo. Certificado de conclusão incluso.",
    category: "Curso Online",
    pointsCost: 600,
    totalQuantity: 80,
    availableQuantity: 65,
    redeemedCount: 15,
    isActive: true,
    expiryDate: "2024-12-15",
    provider: "Academia Online",
    terms: "Acesso por 6 meses. Certificado emitido após conclusão de 80% do curso.",
  },
  {
    id: "6",
    title: "Cashback 10% em Tintas",
    description: "Receba 10% de cashback em compras de tintas e vernizes. Valor creditado em até 30 dias.",
    category: "Cashback",
    pointsCost: 300,
    totalQuantity: 150,
    availableQuantity: 12,
    redeemedCount: 138,
    isActive: false,
    expiryDate: "2024-09-30",
    provider: "Tintas Premium",
    terms: "Cashback limitado a R$ 200 por resgate. Válido apenas para compras presenciais.",
  },
]

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>(mockBenefits)
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isRedemptionsModalOpen, setIsRedemptionsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleCreate = () => {
    setSelectedBenefit(null)
    setFormMode("create")
    setIsFormModalOpen(true)
  }

  const handleEdit = (benefit: Benefit) => {
    setSelectedBenefit(benefit)
    setFormMode("edit")
    setIsFormModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este benefício?")) {
      setBenefits((prev) => prev.filter((b) => b.id !== id))
    }
  }

  const handleViewDetails = (benefit: Benefit) => {
    setSelectedBenefit(benefit)
    // Could open a details modal here
  }

  const handleViewRedemptions = (benefit: Benefit) => {
    setSelectedBenefit(benefit)
    setIsRedemptionsModalOpen(true)
  }

  const handleSave = (benefitData: Omit<Benefit, "id" | "redeemedCount" | "availableQuantity">) => {
    if (formMode === "create") {
      const newBenefit: Benefit = {
        ...benefitData,
        id: Date.now().toString(),
        redeemedCount: 0,
        availableQuantity: benefitData.totalQuantity,
      }
      setBenefits((prev) => [...prev, newBenefit])
    } else if (selectedBenefit) {
      setBenefits((prev) =>
        prev.map((b) =>
          b.id === selectedBenefit.id
            ? {
                ...benefitData,
                id: selectedBenefit.id,
                redeemedCount: selectedBenefit.redeemedCount,
                availableQuantity: benefitData.totalQuantity - selectedBenefit.redeemedCount,
              }
            : b,
        ),
      )
    }
  }

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.provider.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || benefit.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && benefit.isActive) ||
      (statusFilter === "inactive" && !benefit.isActive) ||
      (statusFilter === "low-stock" && benefit.availableQuantity <= benefit.totalQuantity * 0.1) ||
      (statusFilter === "expiring" &&
        benefit.expiryDate &&
        new Date(benefit.expiryDate).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const activeCount = benefits.filter((b) => b.isActive).length
  const inactiveCount = benefits.filter((b) => !b.isActive).length
  const totalRedemptions = benefits.reduce((acc, b) => acc + b.redeemedCount, 0)
  const lowStockCount = benefits.filter((b) => b.availableQuantity <= b.totalQuantity * 0.1).length

  const categories = [...new Set(benefits.map((b) => b.category))]

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Benefícios e Resgates</h1>
            <p className="text-muted-foreground">Gerencie benefícios disponíveis e acompanhe resgates</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Benefício
            </Button>
          </div>
        </div>

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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, descrição ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">
            {filteredBenefits.length} benefício{filteredBenefits.length !== 1 ? "s" : ""} encontrado
            {filteredBenefits.length !== 1 ? "s" : ""}
          </Badge>
          {categoryFilter !== "all" && (
            <Badge variant="outline" className="text-primary">
              Categoria: {categoryFilter}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline" className="text-secondary">
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
          {filteredBenefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onViewRedemptions={handleViewRedemptions}
            />
          ))}
        </div>

        {filteredBenefits.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Nenhum benefício encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
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
      </div>
    </AdminLayout>
  )
}
