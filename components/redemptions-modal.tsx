"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Calendar, Gift, User, CheckCircle, Clock, XCircle } from "lucide-react"

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

interface Redemption {
  id: string
  userId: string
  userName: string
  userEmail: string
  redemptionDate: string
  status: "pending" | "approved" | "used" | "expired" | "cancelled"
  redemptionCode: string
  usedDate?: string
  notes?: string
}

interface RedemptionsModalProps {
  benefit: Benefit | null
  isOpen: boolean
  onClose: () => void
}

// Mock data for redemptions
const mockRedemptions: Redemption[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Ana Silva",
    userEmail: "ana@email.com",
    redemptionDate: "2024-09-10",
    status: "used",
    redemptionCode: "DESC2024-001",
    usedDate: "2024-09-12",
    notes: "Desconto aplicado com sucesso",
  },
  {
    id: "2",
    userId: "u2",
    userName: "Carlos Santos",
    userEmail: "carlos@email.com",
    redemptionDate: "2024-09-11",
    status: "approved",
    redemptionCode: "DESC2024-002",
  },
  {
    id: "3",
    userId: "u3",
    userName: "Maria Oliveira",
    userEmail: "maria@email.com",
    redemptionDate: "2024-09-12",
    status: "pending",
    redemptionCode: "DESC2024-003",
  },
  {
    id: "4",
    userId: "u4",
    userName: "João Costa",
    userEmail: "joao@email.com",
    redemptionDate: "2024-09-08",
    status: "expired",
    redemptionCode: "DESC2024-004",
    notes: "Código expirou sem uso",
  },
  {
    id: "5",
    userId: "u5",
    userName: "Fernanda Lima",
    userEmail: "fernanda@email.com",
    redemptionDate: "2024-09-13",
    status: "used",
    redemptionCode: "DESC2024-005",
    usedDate: "2024-09-13",
  },
]

export function RedemptionsModal({ benefit, isOpen, onClose }: RedemptionsModalProps) {
  const [redemptions, setRedemptions] = useState<Redemption[]>(mockRedemptions)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  if (!benefit) return null

  const filteredRedemptions = redemptions.filter((redemption) => {
    const matchesSearch =
      redemption.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redemption.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redemption.redemptionCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && redemption.status === "pending") ||
      (activeTab === "approved" && redemption.status === "approved") ||
      (activeTab === "used" && redemption.status === "used") ||
      (activeTab === "expired" && redemption.status === "expired")

    return matchesSearch && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        )
      case "used":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Utilizado
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600 text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline" className="text-xs">Desconhecido</Badge>
    }
  }

  const pendingCount = redemptions.filter((r) => r.status === "pending").length
  const approvedCount = redemptions.filter((r) => r.status === "approved").length
  const usedCount = redemptions.filter((r) => r.status === "used").length
  const expiredCount = redemptions.filter((r) => r.status === "expired").length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <Gift className="h-5 w-5" />
            <span className="text-lg">{benefit.title} - Resgates</span>
            <Badge variant="outline" className="text-primary">
              {redemptions.length} resgates
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col px-6 py-4 space-y-4 overflow-hidden">
          {/* Stats - Compactas em uma linha */}
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-card-foreground">{redemptions.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pendentes</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{approvedCount}</div>
              <div className="text-xs text-muted-foreground">Aprovados</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{usedCount}</div>
              <div className="text-xs text-muted-foreground">Utilizados</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-600">{expiredCount}</div>
              <div className="text-xs text-muted-foreground">Expirados</div>
            </div>
          </div>

          {/* Search e Export - Em linha */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário, email ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs compactas */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mb-3">
              <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">Pendentes</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs">Aprovados</TabsTrigger>
              <TabsTrigger value="used" className="text-xs">Utilizados</TabsTrigger>
              <TabsTrigger value="expired" className="text-xs">Expirados</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-2">
                <div className="space-y-2">
                  {filteredRedemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-muted/25 transition-colors"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {redemption.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-card-foreground text-sm truncate">
                            {redemption.userName}
                          </h4>
                          {getStatusBadge(redemption.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 truncate">
                            <User className="h-3 w-3 shrink-0" />
                            <span className="truncate">{redemption.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <Gift className="h-3 w-3 shrink-0" />
                            <span className="truncate">{redemption.redemptionCode}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>{redemption.redemptionDate}</span>
                          </div>
                          {redemption.usedDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 shrink-0" />
                              <span>Usado {redemption.usedDate}</span>
                            </div>
                          )}
                        </div>
                        
                        {redemption.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic truncate">
                            {redemption.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {redemption.status === "pending" && (
                          <Button size="sm" className="gap-1 text-xs px-3">
                            <CheckCircle className="h-3 w-3" />
                            Aprovar
                          </Button>
                        )}
                        {redemption.status === "approved" && (
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent text-xs px-3">
                            <CheckCircle className="h-3 w-3" />
                            Marcar Usado
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredRedemptions.length === 0 && (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhum resgate encontrado.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}