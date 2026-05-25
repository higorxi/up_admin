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
import { AdminContentService, type AdminCommunity } from "@/lib/services/admin-content"
import {
  AlertCircle,
  Calendar,
  Heart,
  Lightbulb,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Tags,
  Trash2,
  Users,
  Edit,
} from "lucide-react"

const defaultColors = ["#4B7BEC", "#20BF6B", "#EB3B5A", "#F7B731", "#8854D0", "#2D98DA"]
const iconOptions = [
  { value: "Users", label: "Pessoas", icon: Users },
  { value: "Sparkles", label: "Beleza", icon: Sparkles },
  { value: "Heart", label: "Bem-estar", icon: Heart },
  { value: "ShoppingBag", label: "Compras", icon: ShoppingBag },
  { value: "MessageCircle", label: "Conversas", icon: MessageCircle },
  { value: "Calendar", label: "Eventos", icon: Calendar },
  { value: "Star", label: "Destaques", icon: Star },
  { value: "Lightbulb", label: "Ideias", icon: Lightbulb },
]

const getIconOption = (value: string) => iconOptions.find((option) => option.value === value) ?? iconOptions[0]

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<AdminCommunity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState<AdminCommunity | null>(null)
  const [communityToDelete, setCommunityToDelete] = useState<AdminCommunity | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", color: defaultColors[0], icon: "Users" })

  const fetchCommunities = async () => {
    try {
      setLoading(true)
      setError(null)
      setCommunities(await AdminContentService.getCommunities())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar comunidades")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  const filteredCommunities = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return communities.filter((community) =>
      `${community.name} ${community.description ?? ""}`.toLowerCase().includes(term),
    )
  }, [communities, searchTerm])

  const openCreateModal = () => {
    setSelectedCommunity(null)
    setFormData({ name: "", description: "", color: defaultColors[0], icon: "Users" })
    setModalOpen(true)
    setError(null)
  }

  const openEditModal = (community: AdminCommunity) => {
    setSelectedCommunity(community)
    setFormData({
      name: community.name,
      description: community.description ?? "",
      color: community.color,
      icon: community.icon,
    })
    setModalOpen(true)
    setError(null)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.name.trim()) {
      setError("Informe o nome da comunidade.")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        icon: formData.icon.trim() || "Users",
      }

      if (selectedCommunity) {
        const updated = await AdminContentService.updateCommunity(selectedCommunity.id, payload)
        setCommunities((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await AdminContentService.createCommunity(payload)
        setCommunities((current) => [created, ...current])
      }

      setModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar comunidade")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!communityToDelete) return

    try {
      setSaving(true)
      setError(null)
      await AdminContentService.deleteCommunity(communityToDelete.id)
      setCommunities((current) => current.filter((item) => item.id !== communityToDelete.id))
      setCommunityToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir comunidade")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Comunidades"
        description="Organize os espaços onde as publicações aparecem para os usuários."
        actions={
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Criar comunidade
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
            <p className="text-sm text-muted-foreground">Total de comunidades</p>
            <p className="text-3xl font-bold">{communities.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Publicações vinculadas</p>
            <p className="text-3xl font-bold">
              {communities.reduce((sum, item) => sum + (item._count?.posts ?? 0), 0)}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Encontradas na busca</p>
            <p className="text-3xl font-bold">{filteredCommunities.length}</p>
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
                <TableHead className="px-4 text-base">Comunidade</TableHead>
                <TableHead className="px-4 text-base">Descrição</TableHead>
                <TableHead className="px-4 text-base">Publicações</TableHead>
                <TableHead className="px-4 text-right text-base">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-base text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    Carregando comunidades...
                  </TableCell>
                </TableRow>
              ) : filteredCommunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-base text-muted-foreground">
                    Nenhuma comunidade encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommunities.map((community) => (
                  <TableRow key={community.id}>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded-full border" style={{ backgroundColor: community.color }} />
                        <div>
                          <p className="text-base font-medium">{community.name}</p>
                          <p className="text-sm text-muted-foreground">Ícone: {getIconOption(community.icon).label}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xl px-4 text-base text-muted-foreground">
                      <span className="line-clamp-2 whitespace-normal">{community.description || "Sem descrição"}</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge variant="outline">{community._count?.posts ?? 0} publicações</Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(community)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCommunityToDelete(community)}>
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
          title={selectedCommunity ? "Editar comunidade" : "Criar comunidade"}
          description="Comunidades ajudam os usuários a encontrar publicações por assunto."
          icon={<Tags className="h-6 w-6" />}
          className="h-auto w-[min(760px,calc(100vw-32px))]"
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Nome da comunidade</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                placeholder="Ex: Dicas de beleza"
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
                placeholder="Explique que tipo de publicação pertence a esta comunidade."
                rows={4}
                className="text-base"
                disabled={saving}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
              <div className="space-y-2">
                <Label className="text-base">Cor da comunidade</Label>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Selecionar cor ${color}`}
                      onClick={() => setFormData((current) => ({ ...current, color }))}
                      className={`h-11 w-11 rounded-md border-2 ${formData.color === color ? "border-foreground" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Ícone da comunidade</Label>
                <div className="grid grid-cols-2 gap-2">
                  {iconOptions.map((option) => {
                    const Icon = option.icon
                    const selected = formData.icon === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, icon: option.value }))}
                        disabled={saving}
                        className={`flex h-14 items-center gap-3 rounded-md border px-3 text-left text-base transition-colors ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
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

        <AlertDialog open={!!communityToDelete} onOpenChange={(open) => !open && setCommunityToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir comunidade?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Esta ação remove a comunidade "{communityToDelete?.name}". Se ela possuir publicações, o sistema vai pedir que elas sejam removidas ou movidas antes.
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
