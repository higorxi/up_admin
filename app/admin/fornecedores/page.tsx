"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { SupplierCard } from "@/components/supplier-card"
import { SupplierDetailsModal } from "@/components/supplier-details-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, UserCheck } from "lucide-react"

// Mock data for suppliers
const mockSuppliers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@decoracoes.com",
    phone: "(11) 99999-9999",
    company: "Silva Decorações",
    category: "Decoração de Interiores",
    location: "São Paulo, SP",
    registrationDate: "15/08/2024",
    status: "pending" as const,
    description:
      "Especialista em decoração de interiores com mais de 10 anos de experiência. Trabalho com projetos residenciais e comerciais, focando em ambientes modernos e funcionais.",
    experience:
      "10 anos de experiência em decoração de interiores, formado em Design de Interiores pela FAAP. Já realizei mais de 200 projetos em São Paulo e região metropolitana.",
    portfolio: "https://portfolio.joaosilva.com",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@arquitetura.com",
    phone: "(21) 88888-8888",
    company: "Santos Arquitetura",
    category: "Arquitetura",
    location: "Rio de Janeiro, RJ",
    registrationDate: "20/08/2024",
    status: "pending" as const,
    description:
      "Arquiteta especializada em projetos residenciais sustentáveis. Foco em soluções inovadoras e eco-friendly para casas e apartamentos.",
    experience:
      "8 anos de experiência em arquitetura, especialização em construção sustentável. Membro do CAU-RJ e certificada em Green Building.",
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    email: "carlos@paisagismo.com",
    phone: "(31) 77777-7777",
    company: "Oliveira Paisagismo",
    category: "Paisagismo",
    location: "Belo Horizonte, MG",
    registrationDate: "10/08/2024",
    status: "approved" as const,
    description:
      "Paisagista com expertise em jardins residenciais e comerciais. Especialista em plantas nativas e projetos de baixa manutenção.",
    experience:
      "12 anos trabalhando com paisagismo, formado em Engenharia Florestal. Especialização em jardins sustentáveis e plantas nativas do cerrado.",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@iluminacao.com",
    phone: "(85) 66666-6666",
    company: "Costa Iluminação",
    category: "Iluminação",
    location: "Fortaleza, CE",
    registrationDate: "25/07/2024",
    status: "rejected" as const,
    description:
      "Especialista em projetos de iluminação residencial e comercial. Trabalho com LED e automação residencial.",
    experience: "6 anos de experiência em iluminação, técnica em eletrotécnica e especialização em LED e automação.",
  },
  {
    id: "5",
    name: "Pedro Lima",
    email: "pedro@marcenaria.com",
    phone: "(47) 55555-5555",
    company: "Lima Marcenaria",
    category: "Marcenaria",
    location: "Joinville, SC",
    registrationDate: "30/08/2024",
    status: "pending" as const,
    description:
      "Marceneiro especializado em móveis planejados e sob medida. Trabalho com madeiras nobres e design contemporâneo.",
    experience:
      "15 anos de experiência em marcenaria, especialista em móveis planejados. Trabalho com madeiras certificadas e design sustentável.",
  },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [selectedSupplier, setSelectedSupplier] = useState<(typeof mockSuppliers)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const handleApprove = (id: string) => {
    setSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === id ? { ...supplier, status: "approved" as const } : supplier)),
    )
  }

  const handleReject = (id: string) => {
    setSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === id ? { ...supplier, status: "rejected" as const } : supplier)),
    )
  }

  const handleViewDetails = (supplier: (typeof mockSuppliers)[0]) => {
    setSelectedSupplier(supplier)
    setIsModalOpen(true)
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const pendingCount = suppliers.filter((s) => s.status === "pending").length
  const approvedCount = suppliers.filter((s) => s.status === "approved").length
  const rejectedCount = suppliers.filter((s) => s.status === "rejected").length

  const categories = [...new Set(suppliers.map((s) => s.category))]

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fornecedores Parceiros</h1>
            <p className="text-muted-foreground">Gerencie aprovações e cadastros de fornecedores</p>
          </div>
        </div>

        {/* Stats 
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-card-foreground">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold text-card-foreground">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejeitados</p>
                <p className="text-2xl font-bold text-card-foreground">{rejectedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-card-foreground">{suppliers.length}</p>
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
              placeholder="Buscar por nome, empresa ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
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
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">
            {filteredSuppliers.length} fornecedor{filteredSuppliers.length !== 1 ? "es" : ""} encontrado
            {filteredSuppliers.length !== 1 ? "s" : ""}
          </Badge>
          {statusFilter !== "all" && (
            <Badge variant="outline" className="text-primary">
              Status: {statusFilter === "pending" ? "Pendente" : statusFilter === "approved" ? "Aprovado" : "Rejeitado"}
            </Badge>
          )}
          {categoryFilter !== "all" && (
            <Badge variant="outline" className="text-secondary">
              Categoria: {categoryFilter}
            </Badge>
          )}
        </div>

        {/* Suppliers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
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
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  )
}
