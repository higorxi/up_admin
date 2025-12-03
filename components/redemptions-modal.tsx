"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Gift, User, CheckCircle, Clock, XCircle, Calendar, Loader2, AlertCircle } from "lucide-react"
import { useBenefits } from "@/hooks/use-benefits"
import type { Benefit, BenefitRedemption } from "@/lib/services/benefits"

interface RedemptionsModalProps {
  benefit: Benefit | null
  isOpen: boolean
  onClose: () => void
}

export function RedemptionsModal({ benefit, isOpen, onClose }: RedemptionsModalProps) {
  const { getRedemptions, updateRedemptionStatus } = useBenefits()
  const [redemptions, setRedemptions] = useState<BenefitRedemption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && benefit) {
      fetchRedemptions()
    }
  }, [isOpen, benefit])

  const fetchRedemptions = async () => {
    if (!benefit) return

    try {
      setLoading(true)
      setError(null)
      const data = await getRedemptions({ benefitId: benefit.id })
      setRedemptions(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar resgates")
      console.error("Error fetching redemptions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (redemptionId: string, newStatus: "PENDING" | "USED" | "CANCELED" | "EXPIRED") => {
    try {
      setActionLoading(redemptionId)
      setError(null)
      
      await updateRedemptionStatus(redemptionId, newStatus)
      
      // Update local state
      setRedemptions(prev => 
        prev.map(r => r.id === redemptionId 
          ? { ...r, status: newStatus, usedAt: newStatus === "USED" ? new Date().toISOString() : r.usedAt }
          : r
        )
      )
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar status do resgate")
      console.error("Error updating redemption status:", err)
    } finally {
      setActionLoading(null)
    }
  }

  if (!benefit) return null

  const filteredRedemptions = redemptions.filter((redemption) => {
    const matchesSearch =
      redemption.professional?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redemption.professional?.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redemption.code?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && redemption.status === "PENDING") ||
      (activeTab === "used" && redemption.status === "USED") ||
      (activeTab === "expired" && redemption.status === "EXPIRED") ||
      (activeTab === "canceled" && redemption.status === "CANCELED")

    return matchesSearch && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "USED":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Utilizado
          </Badge>
        )
      case "EXPIRED":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        )
      case "CANCELED":
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const pendingCount = redemptions.filter((r) => r.status === "PENDING").length
  const usedCount = redemptions.filter((r) => r.status === "USED").length
  const expiredCount = redemptions.filter((r) => r.status === "EXPIRED").length
  const canceledCount = redemptions.filter((r) => r.status === "CANCELED").length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <Gift className="h-5 w-5" />
            <span className="text-lg">{benefit.name} - Resgates</span>
            <Badge variant="outline" className="text-primary">
              {redemptions.length} resgates
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col px-6 py-4 space-y-4 overflow-hidden">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-card-foreground">{redemptions.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pendentes</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{usedCount}</div>
              <div className="text-xs text-muted-foreground">Utilizados</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-600">{expiredCount}</div>
              <div className="text-xs text-muted-foreground">Expirados</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-600">{canceledCount}</div>
              <div className="text-xs text-muted-foreground">Cancelados</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por profissional, email ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mb-3">
              <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">Pendentes</TabsTrigger>
              <TabsTrigger value="used" className="text-xs">Utilizados</TabsTrigger>
              <TabsTrigger value="expired" className="text-xs">Expirados</TabsTrigger>
              <TabsTrigger value="canceled" className="text-xs">Cancelados</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {filteredRedemptions.map((redemption) => (
                      <div
                        key={redemption.id}
                        className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-muted/25 transition-colors"
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {redemption.professional?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-card-foreground text-sm truncate">
                              {redemption.professional?.name}
                            </h4>
                            {getStatusBadge(redemption.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 truncate">
                              <User className="h-3 w-3 shrink-0" />
                              <span className="truncate">{redemption.professional?.user.email}</span>
                            </div>
                            {redemption.code && (
                              <div className="flex items-center gap-1 truncate">
                                <Gift className="h-3 w-3 shrink-0" />
                                <span className="truncate">{redemption.code}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span>Resgatado {formatDate(redemption.redeemedAt)}</span>
                            </div>
                            {redemption.usedAt && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 shrink-0" />
                                <span>Usado {formatDate(redemption.usedAt)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">{redemption.pointsSpent} pontos</span>
                            {redemption.expiresAt && (
                              <span className="ml-2">• Expira {formatDate(redemption.expiresAt)}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {redemption.status === "PENDING" && (
                            <>
                              <Button 
                                size="sm" 
                                className="gap-1 text-xs px-3"
                                onClick={() => handleStatusChange(redemption.id, "USED")}
                                disabled={actionLoading === redemption.id}
                              >
                                {actionLoading === redemption.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                                Marcar Usado
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="gap-1 text-xs px-3"
                                onClick={() => handleStatusChange(redemption.id, "CANCELED")}
                                disabled={actionLoading === redemption.id}
                              >
                                <XCircle className="h-3 w-3" />
                                Cancelar
                              </Button>
                            </>
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}