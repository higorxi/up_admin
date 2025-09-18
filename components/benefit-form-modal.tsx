"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Gift, Tag, Calendar, ImageIcon, Coins } from "lucide-react"

interface Benefit {
  id: string
  title: string
  description: string
  category: string
  pointsCost: number
  stock: number
  usedStock: number
  status: "active" | "inactive"
  image: string
  validUntil: string
  createdAt: string
}

interface BenefitFormModalProps {
  benefit: Benefit | null
  isOpen: boolean
  onClose: () => void
  onSave: (benefit: Omit<Benefit, "id" | "usedStock" | "createdAt">) => Promise<void>
  mode: "create" | "edit"
}

const categories = [
  "Desconto em Produtos",
  "Desconto em Serviços",
  "Cashback",
  "Frete Grátis",
  "Acesso Premium",
  "Consultoria Gratuita",
  "Curso Online",
  "E-book",
  "Template",
  "Outros",
]

export function BenefitFormModal({ benefit, isOpen, onClose, onSave, mode }: BenefitFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    pointsCost: 100,
    stock: 50,
    status: "active" as const,
    validUntil: "",
    image: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (benefit && mode === "edit") {
      setFormData({
        title: benefit.title,
        description: benefit.description,
        category: benefit.category,
        pointsCost: benefit.pointsCost,
        stock: benefit.stock,
        status: benefit.status,
        validUntil: benefit.validUntil,
        image: benefit.image,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        pointsCost: 100,
        stock: 50,
        status: "active",
        validUntil: "",
        image: "",
      })
    }
    setErrors({})
  }, [benefit, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório"
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória"
    if (!formData.category) newErrors.category = "Categoria é obrigatória"
    if (formData.pointsCost <= 0) newErrors.pointsCost = "Custo deve ser maior que zero"
    if (formData.stock <= 0) newErrors.stock = "Estoque deve ser maior que zero"
    if (!formData.validUntil) newErrors.validUntil = "Data de validade é obrigatória"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar benefício:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="h-5 w-5" />
            {mode === "create" ? "Criar Benefício" : "Editar Benefício"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* Basic Information */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Informações Básicas
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Benefício *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o benefício e como utilizá-lo..."
                    rows={3}
                    className={errors.description ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={isLoading}
                      >
                        <SelectTrigger className={`pl-10 ${errors.category ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <div className="flex items-center space-x-2 p-3 bg-background rounded border">
                      <Switch
                        id="status"
                        checked={formData.status === "active"}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, status: checked ? "active" : "inactive" })
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="status" className="flex items-center gap-2">
                        <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                          {formData.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Configuration */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Configurações
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pointsCost">Custo em Pontos *</Label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pointsCost"
                      type="number"
                      min="1"
                      value={formData.pointsCost}
                      onChange={(e) => setFormData({ ...formData, pointsCost: Number.parseInt(e.target.value) || 0 })}
                      className={`pl-10 ${errors.pointsCost ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.pointsCost && <p className="text-sm text-red-500">{errors.pointsCost}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque Disponível *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                    className={errors.stock ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validUntil">Válido Até *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className={`pl-10 ${errors.validUntil ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.validUntil && <p className="text-sm text-red-500">{errors.validUntil}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
            {isLoading ? "Salvando..." : mode === "create" ? "Criar Benefício" : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
