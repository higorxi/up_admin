"use client"

import { useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"
import { usePhysicalSales } from "@/hooks/use-physical-sales"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertCircle, RefreshCw, Search } from "lucide-react"

const getPhysicalSaleCode = (sale: {
  code?: string | null
  pointsCode?: string | null
}) => sale.code ?? sale.pointsCode ?? "-"

const getPartnerName = (sale: {
  partnerSupplier?: { tradeName?: string | null; companyName?: string | null } | null
  partner?: { tradeName?: string | null; companyName?: string | null; name?: string | null } | null
}) =>
  sale.partnerSupplier?.tradeName ??
  sale.partnerSupplier?.companyName ??
  sale.partner?.tradeName ??
  sale.partner?.companyName ??
  sale.partner?.name ??
  "-"

const getCustomerName = (sale: { customerName?: string | null; clientName?: string | null }) =>
  sale.customerName ?? sale.clientName ?? "-"

const getSaleAmount = (sale: { saleValue?: number | null; amount?: number | null; value?: number | null }) =>
  sale.saleValue ?? sale.amount ?? sale.value ?? 0

const getProfessionalEmail = (sale: {
  professional?: { email?: string | null; user?: { email?: string | null } | null } | null
  redeemedProfessional?: { email?: string | null } | null
  professionalEmail?: string | null
}) =>
  sale.professional?.email ?? sale.professional?.user?.email ?? sale.redeemedProfessional?.email ?? sale.professionalEmail ?? "-"

const isRedeemed = (sale: { isRedeemed?: boolean | null; status?: string | null; redeemedAt?: string | null }) => {
  if (typeof sale.isRedeemed === "boolean") {
    return sale.isRedeemed
  }

  if (sale.status) {
    const normalizedStatus = sale.status.toUpperCase()
    if (normalizedStatus === "REDEEMED" || normalizedStatus === "RESGATADO") {
      return true
    }
  }

  return Boolean(sale.redeemedAt)
}

export default function PhysicalSalesPage() {
  const { physicalSales, loading, error, refetch } = usePhysicalSales()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "redeemed" | "pending">("all")

  const filteredSales = useMemo(() => {
    return physicalSales.filter((sale) => {
      const code = getPhysicalSaleCode(sale).toLowerCase()
      const partner = getPartnerName(sale).toLowerCase()
      const customer = getCustomerName(sale).toLowerCase()
      const professional = getProfessionalEmail(sale).toLowerCase()
      const search = searchTerm.toLowerCase()

      const matchesSearch =
        !search ||
        code.includes(search) ||
        partner.includes(search) ||
        customer.includes(search) ||
        professional.includes(search)

      const redeemed = isRedeemed(sale)
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "redeemed" && redeemed) ||
        (statusFilter === "pending" && !redeemed)

      return matchesSearch && matchesStatus
    })
  }, [physicalSales, searchTerm, statusFilter])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const getSafeSaleAmount = (sale: { saleValue?: number | null; amount?: number | null; value?: number | null }) => {
    const amount = getSaleAmount(sale)
    return Number.isFinite(amount) ? amount : 0
  }

  const formatDate = (value: string) => {
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return "-"
    return parsedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="Histórico de Conexão Premiada"
        description="Acompanhe todas as vendas físicas registradas e seus resgates"
        actions={
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        }
      >
        {error && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, loja, cliente ou profissional..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10 border-border/50"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === "redeemed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("redeemed")}
            >
              Resgatados
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pendentes
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-muted-foreground border-border/50 bg-muted/30 font-medium">
            {filteredSales.length} venda física encontrada{filteredSales.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <div className="border rounded-md bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Loja/Parceiro</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor da Venda</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Carregando histórico...
                  </TableCell>
                </TableRow>
              ) : filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma venda física encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => {
                  const redeemed = isRedeemed(sale)
                  return (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{getPhysicalSaleCode(sale)}</TableCell>
                      <TableCell>{getPartnerName(sale)}</TableCell>
                      <TableCell>{getCustomerName(sale)}</TableCell>
                      <TableCell>{formatCurrency(getSafeSaleAmount(sale))}</TableCell>
                      <TableCell>{getProfessionalEmail(sale)}</TableCell>
                      <TableCell>
                        {redeemed ? (
                          <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100">
                            Resgatado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-700 border-yellow-500 bg-yellow-50">
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(sale.createdAt)}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </AdminPageLayout>
    </AdminLayout>
  )
}
