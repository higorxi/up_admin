"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { AdminDialog } from "@/components/admin-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { AdminContentService, type AdminAuthor, type AdminReport } from "@/lib/services/admin-content"
import { AlertCircle, Edit, Eye, Flag, Loader2, Plus, Search, Trash2 } from "lucide-react"

const targetTypeLabels: Record<string, string> = {
  POST: "Publicação",
  COMMENT: "Comentário",
  USER: "Usuário",
  COMMUNITY: "Comunidade",
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))

export default function ReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([])
  const [authors, setAuthors] = useState<AdminAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null)
  const [reportToDelete, setReportToDelete] = useState<AdminReport | null>(null)
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    userId: "",
    targetType: "POST",
    targetId: "",
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [reportsData, authorsData] = await Promise.all([
        AdminContentService.getReports(),
        AdminContentService.getPostAuthors(),
      ])
      setReports(reportsData)
      setAuthors(authorsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar denúncias")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredReports = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return reports.filter((report) => {
      const reporter = report.user?.name || report.user?.email || ""
      return `${report.reason} ${report.description ?? ""} ${report.targetType} ${report.targetId} ${reporter}`.toLowerCase().includes(term)
    })
  }, [reports, searchTerm])

  const openCreateModal = () => {
    setSelectedReport(null)
    setFormData({
      reason: "",
      description: "",
      userId: authors[0]?.id ?? "",
      targetType: "POST",
      targetId: "",
    })
    setModalOpen(true)
    setError(null)
  }

  const openEditModal = (report: AdminReport) => {
    setSelectedReport(report)
    setFormData({
      reason: report.reason,
      description: report.description ?? "",
      userId: report.userId,
      targetType: report.targetType,
      targetId: report.targetId,
    })
    setModalOpen(true)
    setError(null)
  }

  const openDetails = (report: AdminReport) => {
    setSelectedReport(report)
    setDetailsOpen(true)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.reason.trim() || !formData.userId || !formData.targetType.trim() || !formData.targetId.trim()) {
      setError("Preencha motivo, denunciante, tipo e identificador do alvo.")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const payload = {
        reason: formData.reason.trim(),
        description: formData.description.trim() || undefined,
        userId: formData.userId,
        targetType: formData.targetType.trim(),
        targetId: formData.targetId.trim(),
      }

      if (selectedReport) {
        const updated = await AdminContentService.updateReport(selectedReport.id, payload)
        setReports((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await AdminContentService.createReport(payload)
        setReports((current) => [created, ...current])
      }

      setModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar denúncia")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!reportToDelete) return

    try {
      setSaving(true)
      setError(null)
      await AdminContentService.deleteReport(reportToDelete.id)
      setReports((current) => current.filter((item) => item.id !== reportToDelete.id))
      setReportToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir denúncia")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Denúncias"
        description="Acompanhe relatos enviados pelos usuários e remova registros já tratados."
        actions={
          <Button size="sm" onClick={openCreateModal} disabled={authors.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Criar denúncia
          </Button>
        }
      >
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total de denúncias</p>
            <p className="text-3xl font-bold">{reports.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Publicações denunciadas</p>
            <p className="text-3xl font-bold">{reports.filter((item) => item.targetType === "POST").length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Encontradas na busca</p>
            <p className="text-3xl font-bold">{filteredReports.length}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por motivo, denunciante, tipo ou código..."
            className="h-12 pl-11 text-base"
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 text-base">Motivo</TableHead>
                <TableHead className="px-4 text-base">Denunciante</TableHead>
                <TableHead className="px-4 text-base">Alvo</TableHead>
                <TableHead className="px-4 text-base">Data</TableHead>
                <TableHead className="px-4 text-right text-base">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-base text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    Carregando denúncias...
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-base text-muted-foreground">
                    Nenhuma denúncia encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="max-w-md px-4">
                      <p className="text-base font-medium">{report.reason}</p>
                      <p className="line-clamp-2 whitespace-normal text-sm text-muted-foreground">{report.description || "Sem descrição"}</p>
                    </TableCell>
                    <TableCell className="px-4 text-base">{report.user?.name || report.user?.email || "Sem nome"}</TableCell>
                    <TableCell className="px-4">
                      <Badge variant="outline">{targetTypeLabels[report.targetType] || report.targetType}</Badge>
                    </TableCell>
                    <TableCell className="px-4 text-base">{formatDate(report.createdAt)}</TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openDetails(report)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(report)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setReportToDelete(report)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AdminDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={selectedReport ? "Editar denúncia" : "Criar denúncia"}
          description="Use esta área para registrar ou corrigir uma denúncia. Para casos comuns, prefira revisar o conteúdo antes de excluir."
          icon={<Flag className="h-6 w-6" />}
          className="w-[min(860px,calc(100vw-32px))]"
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-base">Denunciante</Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData((current) => ({ ...current, userId: value }))}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione o denunciante" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name || author.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Tipo do alvo</Label>
                <Select value={formData.targetType} onValueChange={(value) => setFormData((current) => ({ ...current, targetType: value }))}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">Publicação</SelectItem>
                    <SelectItem value="COMMENT">Comentário</SelectItem>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="COMMUNITY">Comunidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetId" className="text-base">Código do item denunciado</Label>
              <Input
                id="targetId"
                value={formData.targetId}
                onChange={(event) => setFormData((current) => ({ ...current, targetId: event.target.value }))}
                placeholder="Cole aqui o código do item denunciado"
                className="h-12 text-base"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-base">Motivo</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(event) => setFormData((current) => ({ ...current, reason: event.target.value }))}
                placeholder="Ex: Conteúdo impróprio"
                className="h-12 text-base"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                placeholder="Descreva o que aconteceu."
                rows={6}
                className="text-base"
                disabled={saving}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </AdminDialog>

        <AdminDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          title="Detalhes da denúncia"
          description="Confira as informações antes de agir sobre o conteúdo denunciado."
          icon={<Flag className="h-6 w-6" />}
          className="h-auto w-[min(760px,calc(100vw-32px))]"
        >
          {selectedReport && (
            <div className="space-y-4 text-base">
              <div>
                <p className="text-sm text-muted-foreground">Motivo</p>
                <p className="font-medium">{selectedReport.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="whitespace-pre-wrap">{selectedReport.description || "Sem descrição"}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Denunciante</p>
                  <p>{selectedReport.user?.name || selectedReport.user?.email || "Sem nome"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p>{formatDate(selectedReport.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Item denunciado</p>
                <p>{targetTypeLabels[selectedReport.targetType] || selectedReport.targetType}</p>
                <p className="break-all text-sm text-muted-foreground">{selectedReport.targetId}</p>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => setDetailsOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          )}
        </AdminDialog>

        <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir denúncia?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                A denúncia "{reportToDelete?.reason}" será removida da lista administrativa. Isso não exclui automaticamente o conteúdo denunciado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminPageLayout>
    </AdminLayout>
  )
}
