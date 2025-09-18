"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Gift, Calendar, Package, TrendingUp } from "lucide-react"

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

interface BenefitCardProps {
  benefit: Benefit
  onEdit: (benefit: Benefit) => void
  onDelete: (id: string) => void
  onViewDetails: (benefit: Benefit) => void
  onViewRedemptions: (benefit: Benefit) => void
}

export function BenefitCard({ benefit, onEdit, onDelete, onViewDetails, onViewRedemptions }: BenefitCardProps) {
  const getAvailabilityColor = () => {
    const percentage = (benefit.availableQuantity / benefit.totalQuantity) * 100
    if (percentage <= 10) return "text-red-600"
    if (percentage <= 30) return "text-yellow-600"
    return "text-green-600"
  }

  const isExpiringSoon = () => {
    if (!benefit.expiryDate) return false
    const expiryDate = new Date(benefit.expiryDate)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const isExpired = () => {
    if (!benefit.expiryDate) return false
    const expiryDate = new Date(benefit.expiryDate)
    const today = new Date()
    return expiryDate < today
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-card-foreground line-clamp-1">{benefit.title}</h3>
              <Badge variant={benefit.isActive ? "default" : "secondary"}>
                {benefit.isActive ? "Ativo" : "Inativo"}
              </Badge>
              {isExpiringSoon() && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  Expira em breve
                </Badge>
              )}
              {isExpired() && (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Expirado
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{benefit.category}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{benefit.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gift className="h-4 w-4" />
            <span>{benefit.pointsCost} pontos</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span className={getAvailabilityColor()}>
              {benefit.availableQuantity}/{benefit.totalQuantity} disponíveis
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{benefit.redeemedCount} resgates</span>
          </div>
          {benefit.expiryDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Expira em {benefit.expiryDate}</span>
            </div>
          )}
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground">
            <strong>Fornecedor:</strong> {benefit.provider}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(benefit)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Detalhes
          </Button>
          <Button variant="outline" size="sm" onClick={() => onViewRedemptions(benefit)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Resgates
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(benefit)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(benefit.id)} className="flex-1">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
