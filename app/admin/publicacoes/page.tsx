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
import {
  AdminContentService,
  type AdminAuthor,
  type AdminCommunity,
  type AdminPost,
} from "@/lib/services/admin-content"
import { AlertCircle, Edit, Loader2, MessageSquareText, Plus, Search, Trash2 } from "lucide-react"

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date))

export default function PostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [authors, setAuthors] = useState<AdminAuthor[]>([])
  const [communities, setCommunities] = useState<AdminCommunity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null)
  const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorId: "",
    communityId: "",
    attachedImage: "",
    hashtags: "",
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [postsData, authorsData, communitiesData] = await Promise.all([
        AdminContentService.getPosts(),
        AdminContentService.getPostAuthors(),
        AdminContentService.getCommunities(),
      ])
      setPosts(postsData)
      setAuthors(authorsData)
      setCommunities(communitiesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar publicações")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredPosts = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return posts.filter((post) => {
      const authorName = post.author?.name || post.author?.email || ""
      return `${post.title} ${post.content} ${authorName} ${post.community?.name ?? ""}`.toLowerCase().includes(term)
    })
  }, [posts, searchTerm])

  const openCreateModal = () => {
    setSelectedPost(null)
    setFormData({
      title: "",
      content: "",
      authorId: authors[0]?.id ?? "",
      communityId: communities[0]?.id ?? "",
      attachedImage: "",
      hashtags: "",
    })
    setModalOpen(true)
    setError(null)
  }

  const openEditModal = (post: AdminPost) => {
    setSelectedPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      communityId: post.communityId,
      attachedImage: post.attachedImage ?? "",
      hashtags: post.postHashtags?.map((item) => item.hashtag.name).join(", ") ?? "",
    })
    setModalOpen(true)
    setError(null)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.title.trim() || !formData.content.trim() || !formData.authorId || !formData.communityId) {
      setError("Preencha título, texto, autor e comunidade.")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        authorId: formData.authorId,
        communityId: formData.communityId,
        image: formData.attachedImage.trim(),
        attachedImage: formData.attachedImage.trim() || undefined,
        hashtags: formData.hashtags
          .split(",")
          .map((item) => item.trim().replace(/^#/, ""))
          .filter(Boolean),
      }

      if (selectedPost) {
        const updated = await AdminContentService.updatePost(selectedPost.id, payload)
        setPosts((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await AdminContentService.createPost(payload)
        setPosts((current) => [created, ...current])
      }

      setModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar publicação")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      setSaving(true)
      setError(null)
      await AdminContentService.deletePost(postToDelete.id)
      setPosts((current) => current.filter((item) => item.id !== postToDelete.id))
      setPostToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir publicação")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Publicações"
        description="Gerencie os conteúdos publicados nas comunidades."
        actions={
          <Button size="sm" onClick={openCreateModal} disabled={authors.length === 0 || communities.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Criar publicação
          </Button>
        }
      >
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total de publicações</p>
            <p className="text-3xl font-bold">{posts.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Curtidas</p>
            <p className="text-3xl font-bold">{posts.reduce((sum, item) => sum + (item._count?.likes ?? 0), 0)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Comentários</p>
            <p className="text-3xl font-bold">{posts.reduce((sum, item) => sum + (item._count?.comments ?? 0), 0)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Encontradas</p>
            <p className="text-3xl font-bold">{filteredPosts.length}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por título, texto, autor ou comunidade..."
            className="h-12 pl-11 text-base"
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 text-base">Publicação</TableHead>
                <TableHead className="px-4 text-base">Autor</TableHead>
                <TableHead className="px-4 text-base">Comunidade</TableHead>
                <TableHead className="px-4 text-base">Data</TableHead>
                <TableHead className="px-4 text-right text-base">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-base text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    Carregando publicações...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-base text-muted-foreground">
                    Nenhuma publicação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-lg px-4">
                      <p className="text-base font-medium">{post.title}</p>
                      <p className="line-clamp-2 whitespace-normal text-sm text-muted-foreground">{post.content}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline">{post._count?.likes ?? 0} curtidas</Badge>
                        <Badge variant="outline">{post._count?.comments ?? 0} comentários</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-base">{post.author?.name || post.author?.email || "Sem nome"}</TableCell>
                    <TableCell className="px-4 text-base">{post.community?.name || "Sem comunidade"}</TableCell>
                    <TableCell className="px-4 text-base">{formatDate(post.createdAt)}</TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPostToDelete(post)}>
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
          title={selectedPost ? "Editar publicação" : "Criar publicação"}
          description="Confira autor e comunidade antes de salvar. Essa publicação aparece para os usuários."
          icon={<MessageSquareText className="h-6 w-6" />}
          className="w-[min(900px,calc(100vw-32px))]"
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                placeholder="Digite o título da publicação"
                className="h-12 text-base"
                disabled={saving}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-base">Autor</Label>
                <Select value={formData.authorId} onValueChange={(value) => setFormData((current) => ({ ...current, authorId: value }))}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione o autor" />
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
                <Label className="text-base">Comunidade</Label>
                <Select value={formData.communityId} onValueChange={(value) => setFormData((current) => ({ ...current, communityId: value }))}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecione a comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base">Texto da publicação</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))}
                placeholder="Escreva o conteúdo que será publicado."
                rows={7}
                className="text-base"
                disabled={saving}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attachedImage" className="text-base">Link da imagem</Label>
                <Input
                  id="attachedImage"
                  value={formData.attachedImage}
                  onChange={(event) => setFormData((current) => ({ ...current, attachedImage: event.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="h-12 text-base"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hashtags" className="text-base">Hashtags</Label>
                <Input
                  id="hashtags"
                  value={formData.hashtags}
                  onChange={(event) => setFormData((current) => ({ ...current, hashtags: event.target.value }))}
                  placeholder="beleza, dicas, novidades"
                  className="h-12 text-base"
                  disabled={saving}
                />
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

        <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir publicação?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                A publicação "{postToDelete?.title}" será apagada junto com curtidas e comentários. Essa ação não pode ser desfeita pela tela.
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
