"use client"

import { useEffect, useMemo, useState } from "react"
import { Building2, Edit, PackagePlus, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { SuppliersService, type Supplier, type SupplierProduct, type SupplierProductPayload, type SupplierStorePayload } from "@/lib/services/suppliers"
import { AdminDialog } from "@/components/admin-dialog"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminContentService, type AdminStoreCategory } from "@/lib/services/admin-content"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog"

interface SupplierStoreManagerDialogProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
  onChanged: () => Promise<void>
}

const emptyStoreDraft = (supplierId?: string): SupplierStorePayload => ({
  partnerId: supplierId,
  name: "",
  description: "",
  website: "",
  openingHours: "",
  logoUrl: "",
  categoryId: "",
  address: {
    state: "",
    city: "",
    district: "",
    street: "",
    complement: "",
    number: "",
    zipCode: "",
  },
})

const emptyProductDraft = (): SupplierProductPayload => ({
  name: "",
  description: "",
  price: 0,
  link: "",
  featured: false,
  promotion: false,
  photoUrl: "",
  duration: "",
})

export function SupplierStoreManagerDialog({ supplier, isOpen, onClose, onChanged }: SupplierStoreManagerDialogProps) {
  const [storeDraft, setStoreDraft] = useState<SupplierStorePayload>(emptyStoreDraft())
  const [productDraft, setProductDraft] = useState<SupplierProductPayload>(emptyProductDraft())
  const [productToEdit, setProductToEdit] = useState<SupplierProduct | null>(null)
  const [productToDelete, setProductToDelete] = useState<SupplierProduct | null>(null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<AdminStoreCategory[]>([])

  useEffect(() => {
    AdminContentService.getStoreCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const store = supplier?.store ?? null
  const products = useMemo(() => store?.products ?? [], [store?.products])

  useEffect(() => {
    if (!supplier || !isOpen) return

    setStoreDraft({
      partnerId: supplier.id,
      name: store?.name ?? "",
      description: store?.description ?? "",
      website: store?.website ?? "",
      openingHours: store?.openingHours ?? "",
      logoUrl: store?.logoUrl ?? "",
      categoryId: store?.categoryId ?? "",
      address: {
        state: store?.address?.state ?? "",
        city: store?.address?.city ?? "",
        district: store?.address?.district ?? "",
        street: store?.address?.street ?? "",
        complement: store?.address?.complement ?? "",
        number: store?.address?.number ?? "",
        zipCode: store?.address?.zipCode ?? "",
      },
    })
    setProductDraft(emptyProductDraft())
    setProductToEdit(null)
    setProductToDelete(null)
  }, [supplier, isOpen, store])

  if (!supplier) return null

  const updateStoreField = (field: keyof SupplierStorePayload, value: string) => {
    setStoreDraft((prev) => ({ ...prev, [field]: value }))
  }

  const updateAddressField = (field: keyof NonNullable<SupplierStorePayload["address"]>, value: string) => {
    setStoreDraft((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value,
      },
    }))
  }

  const updateProductField = (field: keyof SupplierProductPayload, value: string | number | boolean) => {
    setProductDraft((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveStore = async () => {
    setSaving(true)
    try {
      if (store?.id) {
        await SuppliersService.updateStore(store.id, storeDraft)
      } else {
        await SuppliersService.createStore({ ...storeDraft, partnerId: supplier.id })
      }

      await onChanged()
      toast({
        title: store?.id ? "Loja atualizada" : "Loja criada",
        description: "Os dados da loja foram salvos com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar loja",
        description: error instanceof Error ? error.message : "Não foi possível salvar os dados da loja.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const startProductEdit = (product: SupplierProduct) => {
    setProductToEdit(product)
    setProductDraft({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      link: product.link ?? "",
      featured: product.featured,
      promotion: product.promotion,
      photoUrl: product.photoUrl ?? "",
      duration: product.duration ?? "",
    })
  }

  const resetProductForm = () => {
    setProductToEdit(null)
    setProductDraft(emptyProductDraft())
  }

  const handleSaveProduct = async () => {
    if (!store?.id) {
      toast({
        title: "Crie a loja primeiro",
        description: "Produtos precisam estar vinculados a uma loja.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...productDraft,
        price: Number(productDraft.price) || 0,
      }

      if (productToEdit) {
        await SuppliersService.updateProduct(productToEdit.id, payload)
      } else {
        await SuppliersService.createProduct(store.id, payload)
      }

      await onChanged()
      resetProductForm()
      toast({
        title: productToEdit ? "Produto atualizado" : "Produto criado",
        description: "A vitrine da loja foi atualizada.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: error instanceof Error ? error.message : "Não foi possível salvar o produto.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    setSaving(true)
    try {
      await SuppliersService.deleteProduct(productToDelete.id)
      await onChanged()
      setProductToDelete(null)
      toast({
        title: "Produto excluído",
        description: "O produto foi removido da loja.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        description: error instanceof Error ? error.message : "Não foi possível excluir o produto.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <AdminDialog
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
        title={`Loja e Produtos de ${supplier.tradeName}`}
        description="Gerencie cadastro da loja, endereço e vitrine de produtos do lojista."
        icon={<Building2 className="h-6 w-6 flex-shrink-0" />}
      >
          <Tabs defaultValue="store" className="space-y-5">
            <TabsList className="grid h-12 w-full grid-cols-2">
              <TabsTrigger value="store">Loja</TabsTrigger>
              <TabsTrigger value="products">Produtos ({products.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="store" className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Nome da loja</Label>
                  <Input id="store-name" value={storeDraft.name ?? ""} onChange={(event) => updateStoreField("name", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-website">Site</Label>
                  <Input id="store-website" value={storeDraft.website ?? ""} onChange={(event) => updateStoreField("website", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-hours">Horário de funcionamento</Label>
                  <Input id="store-hours" value={storeDraft.openingHours ?? ""} onChange={(event) => updateStoreField("openingHours", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-logo">Logo URL</Label>
                  <Input id="store-logo" value={storeDraft.logoUrl ?? ""} onChange={(event) => updateStoreField("logoUrl", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-category">Categoria</Label>
                  <Select
                    value={storeDraft.categoryId || undefined}
                    onValueChange={(value) => updateStoreField("categoryId", value)}
                  >
                    <SelectTrigger id="store-category">
                      <SelectValue placeholder="Selecione a categoria (móveis, tapetes...)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="store-description">Descrição</Label>
                  <Textarea id="store-description" value={storeDraft.description ?? ""} onChange={(event) => updateStoreField("description", event.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="store-zip">CEP</Label>
                  <Input id="store-zip" value={storeDraft.address?.zipCode ?? ""} onChange={(event) => updateAddressField("zipCode", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-state">Estado</Label>
                  <Input id="store-state" value={storeDraft.address?.state ?? ""} onChange={(event) => updateAddressField("state", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-city">Cidade</Label>
                  <Input id="store-city" value={storeDraft.address?.city ?? ""} onChange={(event) => updateAddressField("city", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-district">Bairro</Label>
                  <Input id="store-district" value={storeDraft.address?.district ?? ""} onChange={(event) => updateAddressField("district", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-street">Rua</Label>
                  <Input id="store-street" value={storeDraft.address?.street ?? ""} onChange={(event) => updateAddressField("street", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-number">Número</Label>
                  <Input id="store-number" value={storeDraft.address?.number ?? ""} onChange={(event) => updateAddressField("number", event.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="store-complement">Complemento</Label>
                  <Input id="store-complement" value={storeDraft.address?.complement ?? ""} onChange={(event) => updateAddressField("complement", event.target.value)} />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSaveStore} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {store?.id ? "Salvar loja" : "Criar loja"}
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="products" className="space-y-5">
              <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
                <div className="space-y-4 rounded-md border bg-card p-4">
                  <div>
                    <h3 className="text-lg font-semibold">{productToEdit ? "Editar produto" : "Novo produto"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Cadastre a vitrine que aparece para os usuários.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                      <Label htmlFor="product-name">Nome do produto</Label>
                      <Input id="product-name" value={productDraft.name} onChange={(event) => updateProductField("name", event.target.value)} disabled={!store?.id} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Preço</Label>
                      <Input id="product-price" type="number" step="0.01" value={productDraft.price} onChange={(event) => updateProductField("price", Number(event.target.value))} disabled={!store?.id} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-duration">Duração</Label>
                      <Input id="product-duration" value={productDraft.duration ?? ""} onChange={(event) => updateProductField("duration", event.target.value)} disabled={!store?.id} />
                    </div>
                    <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                      <Label htmlFor="product-link">Link</Label>
                      <Input id="product-link" value={productDraft.link ?? ""} onChange={(event) => updateProductField("link", event.target.value)} disabled={!store?.id} />
                    </div>
                    <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                      <Label htmlFor="product-photo">Foto URL</Label>
                      <Input id="product-photo" value={productDraft.photoUrl ?? ""} onChange={(event) => updateProductField("photoUrl", event.target.value)} disabled={!store?.id} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 rounded-md border bg-background p-3 sm:col-span-2 xl:col-span-1">
                      <div className="flex items-center gap-2">
                        <Switch checked={productDraft.featured ?? false} onCheckedChange={(checked) => updateProductField("featured", checked)} disabled={!store?.id} />
                        <Label>Destaque</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={productDraft.promotion ?? false} onCheckedChange={(checked) => updateProductField("promotion", checked)} disabled={!store?.id} />
                        <Label>Promoção</Label>
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                      <Label htmlFor="product-description">Descrição</Label>
                      <Textarea id="product-description" className="min-h-28" value={productDraft.description ?? ""} onChange={(event) => updateProductField("description", event.target.value)} disabled={!store?.id} />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end xl:flex-col-reverse">
                    {productToEdit && (
                      <Button variant="outline" onClick={resetProductForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo produto
                      </Button>
                    )}
                    <Button onClick={handleSaveProduct} disabled={saving || !store?.id}>
                      <PackagePlus className="h-4 w-4 mr-2" />
                      {productToEdit ? "Salvar produto" : "Adicionar produto"}
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-md border bg-card">
                  <div className="border-b bg-muted/35 px-4 py-3">
                    <h3 className="text-lg font-semibold">Produtos cadastrados</h3>
                    <p className="text-sm text-muted-foreground">{products.length} item(ns) nesta loja.</p>
                  </div>
                <div className="admin-native-scroll overflow-x-auto">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                          {store?.id ? "Nenhum produto cadastrado." : "Crie a loja antes de cadastrar produtos."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{product.description || "Sem descrição"}</div>
                          </TableCell>
                          <TableCell>{Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                          <TableCell className="text-xs">
                            {product.featured ? "Destaque" : "Normal"}
                            {product.promotion ? " / Promoção" : ""}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => startProductEdit(product)} title="Editar produto">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => setProductToDelete(product)} className="text-destructive hover:bg-destructive/10 hover:text-destructive" title="Excluir produto">
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
              </div>
            </TabsContent>
          </Tabs>
      </AdminDialog>

      <AdminConfirmDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Excluir produto?"
        description={`Esta ação remove ${productToDelete?.name ?? "o produto"} da loja. O item deixa de aparecer para os usuários imediatamente.`}
        icon={<Trash2 className="h-5 w-5 text-destructive" />}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProductToDelete(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={saving} loading={saving} loadingText="Excluindo...">
              Excluir
            </Button>
          </div>
        }
      />
    </>
  )
}
