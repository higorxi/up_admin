"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
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
import { AlertCircle, Loader2, Pencil, RefreshCw, Search, XCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { SuppliersService, type PhysicalSale } from "@/lib/services/suppliers"

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
  const [statusFilter, setStatusFilter] = useState<"all" | "redeemed" | "pending" | "cancelled">("all")
  const [editing, setEditing] = useState<PhysicalSale | null>(null)
  const [cancelling, setCancelling] = useState<PhysicalSale | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = async () => {
    if (!cancelling) return
    try {
      setIsCancelling(true)
      await SuppliersService.cancelPhysicalSale(cancelling.id)
      toast({ title: "Lançamento cancelado" })
      setCancelling(null)
      refetch()
    } catch (err) {
      toast({
        title: "Não foi possível cancelar",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

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
      const cancelled = Boolean(sale.cancelledAt)
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "cancelled" && cancelled) ||
        (statusFilter === "redeemed" && redeemed && !cancelled) ||
        (statusFilter === "pending" && !redeemed && !cancelled)

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
            <Button
              variant={statusFilter === "cancelled" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("cancelled")}
            >
              Cancelados
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
                <TableHead>Pontos</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Carregando histórico...
                  </TableCell>
                </TableRow>
              ) : filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
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
                      <TableCell className="font-medium">{(sale.points ?? 0).toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{getProfessionalEmail(sale)}</TableCell>
                      <TableCell>
                        {sale.cancelledAt ? (
                          <Badge variant="outline" className="text-muted-foreground bg-muted">
                            Cancelado
                          </Badge>
                        ) : redeemed ? (
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
                      <TableCell className="text-right">
                        {sale.cancelledAt ? null : (
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditing(sale)} title="Corrigir">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setCancelling(sale)} title="Cancelar">
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </AdminPageLayout>

      <EditSaleDialog
        sale={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          refetch()
        }}
      />

      <Dialog open={!!cancelling} onOpenChange={(open) => !open && !isCancelling && setCancelling(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar lançamento?</DialogTitle>
            <DialogDescription>
              {cancelling && isRedeemed(cancelling)
                ? `Os ${(cancelling.points ?? 0).toLocaleString("pt-BR")} pontos serão retirados do profissional e devolvidos ao limite da loja.`
                : "O código deixa de valer e não poderá mais ser resgatado."}{" "}
              Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelling(null)} disabled={isCancelling}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isCancelling}>
              {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Cancelar lançamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

function EditSaleDialog({ sale, onClose, onSaved }: { sale: PhysicalSale | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ customerName: "", value: "", sellerName: "", invoice: "" })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (sale) {
      setForm({
        customerName: getCustomerName(sale) === "-" ? "" : getCustomerName(sale),
        value: String(getSaleAmount(sale)),
        sellerName: sale.sellerName ?? "",
        invoice: sale.invoice ?? "",
      })
    }
  }, [sale])

  const hasProfessional = Boolean(sale?.professional)
  const value = Number(form.value)
  const diff = sale && Number.isFinite(value) ? Math.ceil(value) - (sale.points ?? 0) : 0

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!sale) return
    if (!form.customerName.trim() || !Number.isFinite(value) || value < 1 || !form.invoice.trim()) {
      toast({ title: "Preencha cliente, nota fiscal e um valor de pelo menos R$ 1,00", variant: "destructive" })
      return
    }
    try {
      setIsSaving(true)
      await SuppliersService.updatePhysicalSale(sale.id, {
        customerName: form.customerName.trim(),
        value,
        sellerName: form.sellerName.trim(),
        invoice: form.invoice.trim(),
      })
      toast({ title: "Lançamento corrigido" })
      onSaved()
    } catch (err) {
      toast({
        title: "Não foi possível corrigir",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={!!sale} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Corrigir lançamento</DialogTitle>
            <DialogDescription>
              Se a venda já foi creditada, a diferença de pontos é ajustada na conta do profissional.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-4">
            <div className="space-y-2">
              <Label>Nome do cliente</Label>
              <Input
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                readOnly={hasProfessional}
                className={hasProfessional ? "cursor-not-allowed bg-muted text-muted-foreground" : undefined}
              />
              {hasProfessional ? (
                <p className="text-xs text-muted-foreground">Venda com profissional: o cliente é o próprio profissional.</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Valor da venda</Label>
              <Input type="number" min={1} step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              {sale && isRedeemed(sale) && diff !== 0 ? (
                <p className={`text-xs ${diff > 0 ? "text-green-700" : "text-destructive"}`}>
                  {diff > 0 ? "+" : ""}
                  {diff.toLocaleString("pt-BR")} pontos para o profissional
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Vendedor</Label>
                <Input value={form.sellerName} onChange={(e) => setForm({ ...form, sellerName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Nota fiscal *</Label>
                <Input value={form.invoice} onChange={(e) => setForm({ ...form, invoice: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Voltar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar correção
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
