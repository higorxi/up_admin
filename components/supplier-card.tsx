"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, Eye, Phone, MapPin, Building, FileText, X, Sparkles, Calendar, Ban } from "lucide-react"
import {
  canSupplierReceiveTrial,
  getSupplierHasActivePlan,
  getSupplierHasTrial,
  getSupplierTrialEndsAt,
  type Supplier,
} from "@/lib/services/suppliers"

interface SupplierCardProps {
  supplier: Supplier
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onGrantTrial?: (supplier: Supplier) => void
  onCancelTrial?: (id: string) => void | Promise<void>
  onViewDetails: (supplier: Supplier) => void
  onDelete?: (id: string) => void
}

export function SupplierCard({
  supplier,
  onApprove,
  onReject,
  onGrantTrial,
  onCancelTrial,
  onViewDetails,
  onDelete,
}: SupplierCardProps) {
  const hasTrial = getSupplierHasTrial(supplier)
  const hasActivePlan = getSupplierHasActivePlan(supplier)
  const canGrantTrial = canSupplierReceiveTrial(supplier)
  const trialEndsAt = getSupplierTrialEndsAt(supplier)

  const formatTrialDate = (dateString: string | null) => {
    if (!dateString) return "Data não informada"

    const parsedDate = new Date(dateString)
    if (Number.isNaN(parsedDate.getTime())) return "Data não informada"

    return parsedDate.toLocaleDateString("pt-BR")
  }

  const getStatusBadge = () => {
    switch (supplier.status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-500 bg-yellow-50 font-medium">
            Pendente
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="text-green-700 border-green-500 bg-green-50 font-medium">
            Aprovado
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-red-700 border-red-500 bg-red-50 font-medium">
            Rejeitado
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-semibold">
                {supplier.tradeName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-card-foreground truncate">{supplier.tradeName}</h3>
              <p className="text-sm text-muted-foreground truncate">{supplier.companyName}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col pt-0">
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <span className="truncate">{supplier.document}</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <span className="truncate">{supplier.contact}</span>
          </div>
          {supplier.store?.address && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="truncate">
                {supplier.store.address.city}, {supplier.store.address.state}
              </span>
            </div>
          )}
          {supplier.store && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                <Building className="h-4 w-4" />
              </div>
              <span className="truncate">{supplier.store.name}</span>
            </div>
          )}
        </div>

        {supplier.store?.description && (
          <div className="flex-1 pt-2">
            <p className="text-sm text-card-foreground/80 line-clamp-2 leading-relaxed">{supplier.store.description}</p>
          </div>
        )}

        {supplier.status === "APPROVED" && hasTrial && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Calendar className="h-4 w-4" />
              Trial ativo
            </div>
            <p className="text-xs text-muted-foreground">Término: {formatTrialDate(trialEndsAt)}</p>
          </div>
        )}

        {supplier.status === "APPROVED" && hasActivePlan && !hasTrial && (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Fornecedor com plano ativo. Trial manual indisponível.</p>
          </div>
        )}

        <div className="flex gap-2 pt-3 mt-auto border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(supplier)}
            className="flex-1 hover:bg-muted/50 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            Detalhes
          </Button>
          {supplier.status === "PENDING" && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove(supplier.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-colors shadow-sm"
              >
                <Check className="h-4 w-4 mr-1.5" />
                Aprovar
              </Button>
              <Button
                size="sm"
                onClick={() => onReject(supplier.id)}
                variant="destructive"
                className="flex-1 transition-colors shadow-sm"
              >
                <X className="h-4 w-4 mr-1.5" />
                Rejeitar
              </Button>
            </>
          )}
          {supplier.status === "APPROVED" && canGrantTrial && onGrantTrial && (
            <Button size="sm" onClick={() => onGrantTrial(supplier)} className="flex-1 shadow-sm">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Conceder Trial
            </Button>
          )}
          {supplier.status === "APPROVED" && hasTrial && onCancelTrial && (
            <Button size="sm" variant="destructive" onClick={() => onCancelTrial(supplier.id)} className="flex-1 shadow-sm">
              <Ban className="h-4 w-4 mr-1.5" />
              Cancelar Trial
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
