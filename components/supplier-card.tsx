"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, X, Eye, Mail, Phone, MapPin, Calendar, Building } from "lucide-react"

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  company: string
  category: string
  location: string
  registrationDate: string
  status: "pending" | "approved" | "rejected"
  description: string
  experience: string
  portfolio?: string
}

interface SupplierCardProps {
  supplier: Supplier
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewDetails: (supplier: Supplier) => void
}

export function SupplierCard({ supplier, onApprove, onReject, onViewDetails }: SupplierCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Aprovado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejeitado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {supplier.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground">{supplier.name}</h3>
              <p className="text-sm text-muted-foreground">{supplier.category}</p>
            </div>
          </div>
          {getStatusBadge(supplier.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{supplier.company}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{supplier.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{supplier.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{supplier.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
            <Calendar className="h-4 w-4" />
            <span>Cadastrado em {supplier.registrationDate}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-card-foreground line-clamp-2">{supplier.description}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(supplier)} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          {supplier.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onApprove(supplier.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onReject(supplier.id)}>
                <X className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
