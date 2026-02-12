"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, Eye, Phone, MapPin, Building, FileText } from "lucide-react"
import type { Supplier } from "@/lib/services/suppliers"

interface SupplierCardProps {
  supplier: Supplier
  onApprove: (id: string) => void
  onViewDetails: (supplier: Supplier) => void
  onDelete?: (id: string) => void
}

export function SupplierCard({ supplier, onApprove, onViewDetails, onDelete }: SupplierCardProps) {
  const getStatusBadge = () => {
    switch (supplier.status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Aprovado
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejeitado
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {supplier.tradeName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground">{supplier.tradeName}</h3>
              <p className="text-sm text-muted-foreground">{supplier.companyName}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{supplier.document}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{supplier.contact}</span>
          </div>
          {supplier.store?.address && (
            <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
              <MapPin className="h-4 w-4" />
              <span>
                {supplier.store.address.city}, {supplier.store.address.state}
              </span>
            </div>
          )}
          {supplier.store && (
            <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
              <Building className="h-4 w-4" />
              <span>{supplier.store.name}</span>
            </div>
          )}
        </div>

        {supplier.store?.description && (
          <div className="flex-1">
            <p className="text-sm text-card-foreground line-clamp-2">{supplier.store.description}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2 mt-auto">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(supplier)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          {supplier.status === "PENDING" && (
            <Button
              size="sm"
              onClick={() => onApprove(supplier.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
