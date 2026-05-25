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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { AdminContentService, type AdminProfession } from "@/lib/services/admin-content"
import { AlertCircle, BriefcaseBusiness, Edit, Loader2, Plus, Search, Trash2 } from "lucide-react"

export default function ProfessionsPage() {
  const [professions, setProfessions] = useState<AdminProfession[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProfession, setSelectedProfession] = useState<AdminProfession | null>(null)
  const [professionToDelete, setProfessionToDelete] = useState<AdminProfession | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  const fetchProfessions = async () => {
    try {
      setLoading(true)
      setError(null)
      setProfessions(await AdminContentService.getProfessions())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar profissões")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfessions()
  }, [])

  const filteredProfessions = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return professions.filter((profession) =>
      `${profession.name} ${profession.description ?? ""}`.toLowerCase().includes(term),
    )
  }, [professions, searchTerm])

  const openCreateModal = () => {
    setSelectedProfession(null)
    setFormData({ name: "", description: "" })
    setModalOpen(true)
    setError(null)
  }

  const openEditModal = (profession: AdminProfession) => {
    setSelectedProfession(profession)
    setFormData({ name: profession.name, description: profession.description ?? "" })
    setModalOpen(true)
    setError(null)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.name.trim()) {
      setError("Informe o nome da profissão.")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      }

      if (selectedProfession) {
        const updated = await AdminContentService.updateProfession(selectedProfession.id, payload)
        setProfessions((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await AdminContentService.createProfession(payload)
        setProfessions((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)))
      }

      setModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar profissão")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!professionToDelete) return

    try {
      setSaving(true)
      setError(null)
      await AdminContentService.deleteProfession(professionToDelete.id)
      setProfessions((current) => current.filter((item) => item.id !== professionToDelete.id))
      setProfessionToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir profissão")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Profissões"
        description="Cadastre e organize as profissões usadas no cadastro dos profissionais."
        actions={
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Criar profissão
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
            <p className="text-sm text-muted-foreground">Total de profissões</p>
            <p className="text-3xl font-bold">{professions.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Profissionais vinculados</p>
            <p className="text-3xl font-bold">
              {professions.reduce((sum, item) => sum + (item._count?.professionals ?? 0), 0)}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Encontradas na busca</p>
            <p className="text-3xl font-bold">{filteredProfessions.length}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className="h-12 pl-11 text-base"
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 text-base">Profissão</TableHead>
                <TableHead className="px-4 text-base">Descrição</TableHead>
                <TableHead className="px-4 text-base">Uso</TableHead>
                <TableHead className="px-4 text-right text-base">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-base text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    Carregando profissões...
                  </TableCell>
                </TableRow>
              ) : filteredProfessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-base text-muted-foreground">
                    Nenhuma profissão encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfessions.map((profession) => (
                  <TableRow key={profession.id}>
                    <TableCell className="px-4 text-base font-medium">{profession.name}</TableCell>
                    <TableCell className="max-w-xl px-4 text-base text-muted-foreground">
                      <span className="line-clamp-2 whitespace-normal">{profession.description || "Sem descrição"}</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge variant="outline">{profession._count?.professionals ?? 0} profissionais</Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(profession)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setProfessionToDelete(profession)}>
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
          title={selectedProfession ? "Editar profissão" : "Criar profissão"}
          description="Use nomes curtos e fáceis de reconhecer no cadastro dos profissionais."
          icon={<BriefcaseBusiness className="h-6 w-6" />}
          className="h-auto w-[min(720px,calc(100vw-32px))]"
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Nome da profissão</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                placeholder="Ex: Cabeleireira"
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
                placeholder="Explique quando esta profissão deve ser usada."
                rows={5}
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

        <AlertDialog open={!!professionToDelete} onOpenChange={(open) => !open && setProfessionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir profissão?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Esta ação remove a profissão "{professionToDelete?.name}". Se ela estiver em uso por algum profissional, o sistema vai impedir a exclusão.
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
