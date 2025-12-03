"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Gift, Calendar, Package, TrendingUp, Power } from "lucide-react"
import type { Benefit } from "@/lib/services/benefits"

interface BenefitCardProps {
  benefit: Benefit
  onEdit: (benefit: Benefit) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
  onViewRedemptions: (benefit: Benefit) => void
  disabled?: boolean
}

export function BenefitCard({ 
  benefit, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onViewRedemptions,
  disabled = false 
}: BenefitCardProps) {
  const availableQuantity = benefit.quantity 
    ? benefit.quantity - (benefit.activeRedemptions || 0)
    : null

  const getAvailabilityColor = () => {
    if (!benefit.quantity || availableQuantity === null) return "text-muted-foreground"
    const percentage = (availableQuantity / benefit.quantity) * 100
    if (percentage <= 10) return "text-red-600"
    if (percentage <= 30) return "text-yellow-600"
    return "text-green-600"
  }

  const isExpiringSoon = () => {
    if (!benefit.expiresAt) return false
    const expiryDate = new Date(benefit.expiresAt)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const isExpired = () => {
    if (!benefit.expiresAt) return false
    const expiryDate = new Date(benefit.expiresAt)
    const today = new Date()
    return expiryDate < today
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-card-foreground line-clamp-1">{benefit.name}</h3>
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
            {benefit.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{benefit.description}</p>
            )}
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
            {benefit.quantity ? (
              <span className={getAvailabilityColor()}>
                {availableQuantity}/{benefit.quantity} disponíveis
              </span>
            ) : (
              <span className="text-green-600">Ilimitado</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{benefit._count?.redemptions || 0} resgates</span>
          </div>
          
          {benefit.expiresAt && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Expira em {formatDate(benefit.expiresAt)}</span>
            </div>
          )}
        </div>

        {benefit.imageUrl && (
          <div className="w-full h-32 rounded-lg overflow-hidden">
            <img 
              src={benefit.imageUrl} 
              alt={benefit.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewRedemptions(benefit)} 
            className="flex-1"
            disabled={disabled}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Resgates
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleStatus(benefit.id)}
            disabled={disabled}
            className="flex-1"
          >
            <Power className="h-4 w-4 mr-2" />
            {benefit.isActive ? "Desativar" : "Ativar"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(benefit)} 
            className="flex-1"
            disabled={disabled}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(benefit.id)} 
            className="flex-1"
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}