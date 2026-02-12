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
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-card-foreground truncate">{benefit.name}</h3>
              <Badge 
                variant="outline"
                className={benefit.isActive 
                  ? "text-green-700 border-green-500 bg-green-50 font-medium" 
                  : "text-gray-700 border-gray-500 bg-gray-50 font-medium"
                }
              >
                {benefit.isActive ? "Ativo" : "Inativo"}
              </Badge>
              {isExpiringSoon() && (
                <Badge variant="outline" className="text-yellow-700 border-yellow-500 bg-yellow-50 font-medium">
                  Expira em breve
                </Badge>
              )}
              {isExpired() && (
                <Badge variant="outline" className="text-red-700 border-red-500 bg-red-50 font-medium">
                  Expirado
                </Badge>
              )}
            </div>
            {benefit.description && (
              <p className="text-sm text-card-foreground/80 line-clamp-2 leading-relaxed">{benefit.description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col pt-0">
        <div className="grid grid-cols-2 gap-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Gift className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{benefit.pointsCost} pontos</span>
          </div>
          
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Package className="h-4 w-4" />
            </div>
            {benefit.quantity ? (
              <span className={`${getAvailabilityColor()} font-medium`}>
                {availableQuantity}/{benefit.quantity}
              </span>
            ) : (
              <span className="text-green-600 font-medium">Ilimitado</span>
            )}
          </div>
          
          <div className="flex items-center gap-2.5 text-muted-foreground col-span-2">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span>{benefit._count?.redemptions || 0} resgates realizados</span>
          </div>
          
          {benefit.expiresAt && (
            <div className="flex items-center gap-2.5 text-muted-foreground col-span-2">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-sm">Expira em {formatDate(benefit.expiresAt)}</span>
            </div>
          )}
        </div>

        <div className="w-full h-36 rounded-xl overflow-hidden bg-muted/30 border border-border/50">
          {benefit.imageUrl ? (
            <img 
              src={benefit.imageUrl} 
              alt={benefit.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto border-t border-border/50 pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewRedemptions(benefit)} 
            className="flex-1 hover:bg-muted/50 transition-colors"
            disabled={disabled}
          >
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Resgates
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggleStatus(benefit.id)}
            disabled={disabled}
            className={`flex-1 transition-colors ${benefit.isActive ? "hover:bg-red-50" : "hover:bg-green-50"}`}
          >
            <Power className="h-4 w-4 mr-1.5" />
            {benefit.isActive ? "Desativar" : "Ativar"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(benefit)} 
            className="flex-1 hover:bg-muted/50 transition-colors"
            disabled={disabled}
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(benefit.id)} 
            className="flex-1 transition-colors shadow-sm"
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}