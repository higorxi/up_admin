"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { AdminDialog } from "@/components/admin-dialog"
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog"
import { useProfessionals } from "@/hooks/use-professionals"
import {
  ProfessionalLevel,
  GetProfessionalsParams,
  CRMProfessional,
  UpdateCRMProfessionalPayload
} from "@/lib/services/professionals"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import {
  Search,
  CheckCircle2,
  XCircle,
  Instagram,
  Linkedin,
  Phone,
  ArrowUpDown,
  FilterX,
  Edit,
  ShieldCheck,
  ShieldX,
  Trash2
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

export default function CRMProfessionalsPage() {
  const [params, setParams] = useState<GetProfessionalsParams>({
    page: 1,
    limit: 10,
    orderBy: "createdAt",
    order: "desc"
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [professionalToEdit, setProfessionalToEdit] = useState<CRMProfessional | null>(null)
  const [professionalToDelete, setProfessionalToDelete] = useState<CRMProfessional | null>(null)
  const [editPayload, setEditPayload] = useState<UpdateCRMProfessionalPayload>({})
  const [actionLoading, setActionLoading] = useState(false)

  const {
    professionals,
    professions,
    meta,
    loading,
    error,
    update,
    toggleVerification,
    deleteProfessional
  } = useProfessionals(params)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setParams(prev => ({ ...prev, search: searchTerm, page: 1 }))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleLevelChange = (value: string) => {
    setParams(prev => ({ ...prev, level: value === "all" ? undefined : value as ProfessionalLevel, page: 1 }))
  }

  const handleProfessionChange = (value: string) => {
    setParams(prev => ({ ...prev, professionId: value === "all" ? undefined : value, page: 1 }))
  }

  const handleVerifiedChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      verified: value === "all" ? undefined : value === "true",
      page: 1
    }))
  }

  const handleSort = (field: "name" | "createdAt" | "points" | "level") => {
    setParams(prev => ({
      ...prev,
      orderBy: field,
      order: prev.orderBy === field && prev.order === "asc" ? "desc" : "asc"
    }))
  }

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setParams({
      page: 1,
      limit: 10,
      orderBy: "createdAt",
      order: "desc"
    })
  }

  const openEditDialog = (professional: CRMProfessional) => {
    setProfessionalToEdit(professional)
    setEditPayload({
      name: professional.name,
      phone: professional.phone,
      document: professional.document ?? "",
      professionId: professional.profession?.id ?? professional.professionId ?? undefined,
      level: professional.level,
      verified: professional.verified,
      featured: professional.featured ?? false,
      description: professional.description ?? "",
      experience: professional.experience ?? "",
      officeName: professional.officeName ?? "",
    })
  }

  const handleEditSave = async () => {
    if (!professionalToEdit) return

    setActionLoading(true)
    try {
      await update(professionalToEdit.id, editPayload)
      toast({
        title: "Profissional atualizado",
        description: "Os dados administrativos foram salvos com sucesso.",
      })
      setProfessionalToEdit(null)
      setEditPayload({})
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o profissional.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleVerification = async (professional: CRMProfessional) => {
    setActionLoading(true)
    try {
      await toggleVerification(professional.id)
      toast({
        title: professional.verified ? "Verificação removida" : "Profissional verificado",
        description: "O status de verificação foi atualizado.",
      })
    } catch (error) {
      toast({
        title: "Erro ao alterar verificação",
        description: error instanceof Error ? error.message : "Não foi possível alterar o status.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!professionalToDelete) return

    setActionLoading(true)
    try {
      await deleteProfessional(professionalToDelete.id)
      toast({
        title: "Profissional desativado",
        description: "O usuário vinculado foi desativado e saiu da listagem do CRM.",
      })
      setProfessionalToDelete(null)
    } catch (error) {
      toast({
        title: "Erro ao desativar",
        description: error instanceof Error ? error.message : "Não foi possível desativar o profissional.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getLevelBadge = (level: ProfessionalLevel) => {
    switch (level) {
      case "BRONZE": return <Badge variant="outline" className="border-orange-500 text-orange-500 bg-orange-50">Bronze</Badge>
      case "SILVER": return <Badge variant="outline" className="border-slate-400 text-slate-400 bg-slate-50">Silver</Badge>
      case "GOLD": return <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-50">Gold</Badge>
      case "PLATINUM": return <Badge variant="outline" className="border-purple-500 text-purple-500 bg-purple-50">Platinum</Badge>
      default: return <Badge variant="outline">{level}</Badge>
    }
  }

  // Helper function for pagination to handle many pages
  const renderPaginationItems = () => {
    if (!meta) return null

    const pages = []
    const totalPages = meta.totalPages
    const currentPage = meta.page

    // Always show first page
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)} className="cursor-pointer">
          1
        </PaginationLink>
      </PaginationItem>
    )

    if (currentPage > 3) {
      pages.push(<PaginationItem key="ellipsis-start"><span className="px-2">...</span></PaginationItem>)
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)} className="cursor-pointer">
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (currentPage < totalPages - 2) {
      pages.push(<PaginationItem key="ellipsis-end"><span className="px-2">...</span></PaginationItem>)
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink isActive={currentPage === totalPages} onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pages
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="CRM de Profissionais"
        description="Visualize e gerencie dados detalhados dos profissionais da plataforma"
      >
        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="space-y-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, documento ou telefone..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Select value={params.level || "all"} onValueChange={handleLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="BRONZE">Bronze</SelectItem>
                <SelectItem value="SILVER">Silver</SelectItem>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="PLATINUM">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select value={params.professionId || "all"} onValueChange={handleProfessionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Profissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Profissões</SelectItem>
                {professions.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Select
                value={params.verified === undefined ? "all" : params.verified.toString()}
                onValueChange={handleVerifiedChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Verificado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status de Verificação</SelectItem>
                  <SelectItem value="true">Verificado</SelectItem>
                  <SelectItem value="false">Não Verificado</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                title="Limpar filtros"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Nome <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Profissão</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("level")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Nível <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("points")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Pontos <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-center">Atividade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Cadastro <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Carregando profissionais...
                    </TableCell>
                  </TableRow>
                ) : professionals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhum profissional encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  professionals.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{professional.name}</span>
                          <span className="text-xs text-muted-foreground">{professional.document || "Documento não informado"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="flex items-center gap-1 truncate max-w-[150px]" title={professional.user?.email}>
                            {professional.user?.email || "Email não informado"}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <Phone className="h-3 w-3" /> {professional.phone}
                          </span>
                          <div className="flex gap-2 mt-1">
                            {professional.social?.instagram && (
                              <a href={professional.social.instagram} target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-3.5 w-3.5 text-muted-foreground hover:text-pink-600 transition-colors" />
                              </a>
                            )}
                            {professional.social?.linkedin && (
                              <a href={professional.social.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-3.5 w-3.5 text-muted-foreground hover:text-blue-600 transition-colors" />
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{professional.profession?.name || "Sem profissão"}</TableCell>
                      <TableCell>{getLevelBadge(professional.level)}</TableCell>
                      <TableCell>{professional.points}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-center">
                          <div className="flex gap-2 text-xs">
                            <div className="flex flex-col items-center">
                              <span className="font-semibold">{professional._count.eventRegistrations}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">Eventos</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-semibold">{professional._count.workshops}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">Workshops</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-semibold">{professional._count.redemptions}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">Resgates</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {professional.verified ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-medium whitespace-nowrap">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verificado
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-medium whitespace-nowrap">
                            <XCircle className="h-3.5 w-3.5" /> Pendente
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(professional.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(professional)}
                            title="Editar dados"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleVerification(professional)}
                            disabled={actionLoading}
                            title={professional.verified ? "Remover verificação" : "Verificar profissional"}
                          >
                            {professional.verified ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setProfessionalToDelete(professional)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Desativar profissional"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && meta && meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {professionals.length} de {meta.total} profissionais
            </div>
            <Pagination className="justify-center sm:justify-end w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => meta.page > 1 && handlePageChange(meta.page - 1)}
                    className={meta.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => meta.page < meta.totalPages && handlePageChange(meta.page + 1)}
                    className={meta.page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <AdminDialog
          open={!!professionalToEdit}
          onOpenChange={(open) => !open && setProfessionalToEdit(null)}
          title="Editar Profissional"
          description="Ajuste dados administrativos, verificação, nível e destaque."
          icon={<Edit className="h-6 w-6 flex-shrink-0" />}
          footer={
            <DialogFooter>
              <Button variant="outline" onClick={() => setProfessionalToEdit(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditSave} disabled={actionLoading}>
                Salvar alterações
              </Button>
            </DialogFooter>
          }
        >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="professional-name">Nome</Label>
                <Input
                  id="professional-name"
                  value={editPayload.name ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional-phone">Telefone</Label>
                <Input
                  id="professional-phone"
                  value={editPayload.phone ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional-document">Documento</Label>
                <Input
                  id="professional-document"
                  value={editPayload.document ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, document: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Profissão</Label>
                <Select
                  value={editPayload.professionId ?? ""}
                  onValueChange={(value) => setEditPayload((prev) => ({ ...prev, professionId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma profissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((profession) => (
                      <SelectItem key={profession.id} value={profession.id}>
                        {profession.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nível</Label>
                <Select
                  value={editPayload.level}
                  onValueChange={(value) => setEditPayload((prev) => ({ ...prev, level: value as ProfessionalLevel }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRONZE">Bronze</SelectItem>
                    <SelectItem value="SILVER">Silver</SelectItem>
                    <SelectItem value="GOLD">Gold</SelectItem>
                    <SelectItem value="PLATINUM">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="professional-verified">Verificado</Label>
                <Switch
                  id="professional-verified"
                  checked={editPayload.verified ?? false}
                  onCheckedChange={(checked) => setEditPayload((prev) => ({ ...prev, verified: checked }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="professional-featured">Destaque</Label>
                <Switch
                  id="professional-featured"
                  checked={editPayload.featured ?? false}
                  onCheckedChange={(checked) => setEditPayload((prev) => ({ ...prev, featured: checked }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="professional-office">Nome do escritório</Label>
                <Input
                  id="professional-office"
                  value={editPayload.officeName ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, officeName: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="professional-description">Descrição</Label>
                <Textarea
                  id="professional-description"
                  value={editPayload.description ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="professional-experience">Experiência</Label>
                <Textarea
                  id="professional-experience"
                  value={editPayload.experience ?? ""}
                  onChange={(event) => setEditPayload((prev) => ({ ...prev, experience: event.target.value }))}
                />
              </div>
            </div>
        </AdminDialog>

        <AdminConfirmDialog
          open={!!professionalToDelete}
          onOpenChange={(open) => !open && setProfessionalToDelete(null)}
          title="Desativar profissional?"
          description={`Esta ação desativa o usuário vinculado a ${professionalToDelete?.name ?? ""} e remove o profissional da listagem do CRM. O histórico de eventos, pontos e resgates permanece preservado.`}
          icon={<Trash2 className="h-5 w-5 text-destructive" />}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProfessionalToDelete(null)} disabled={actionLoading}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                loading={actionLoading}
                loadingText="Desativando..."
              >
                Desativar
              </Button>
            </div>
          }
        />
      </AdminPageLayout>
    </AdminLayout>
  )
}
