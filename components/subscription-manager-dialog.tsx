"use client"

import { useEffect, useState } from "react"
import { AdminDialog } from "@/components/admin-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Ban, CreditCard, History, Pencil } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  SuppliersService,
  getPlanInfo,
  type PlanInfo,
  type PlanSubscriptionLike,
  type PlanType,
  type SubscriptionEvent,
} from "@/lib/services/suppliers"

interface SubscriptionManagerDialogProps {
  isOpen: boolean
  onClose: () => void
  partnerId: string
  partnerName: string
  subscription: PlanSubscriptionLike | null | undefined
  onChanged: () => void | Promise<void>
}

const PLAN_OPTIONS: Array<{ value: PlanType; label: string }> = [
  { value: "TRIAL", label: "Período gratuito" },
  { value: "SILVER", label: "Silver" },
  { value: "GOLD", label: "Gold" },
  { value: "PREMIUM", label: "Premium" },
]

const TONE_BADGE: Record<PlanInfo["tone"], string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-red-50 text-red-700 border-red-300",
  canceled: "bg-muted text-muted-foreground border-border",
  warning: "bg-amber-50 text-amber-700 border-amber-300",
}

const EVENT_LABEL: Record<string, string> = {
  GRANTED: "Plano concedido",
  EDITED: "Plano editado",
  EXTENDED: "Período estendido",
  CANCELED: "Plano cancelado",
  STRIPE_UPDATE: "Atualização Stripe",
}

const SOURCE_LABEL: Record<string, string> = {
  admin: "Admin",
  stripe: "Stripe",
  system: "Automático",
}

const formatDate = (value?: string | null) => {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR")
}

const formatDateTime = (value: string) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("pt-BR")
}

// yyyy-MM-dd para <input type="date">
const toDateInput = (value?: string | null) => {
  if (!value) return ""
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10)
}

export function SubscriptionManagerDialog({
  isOpen,
  onClose,
  partnerId,
  partnerName,
  subscription,
  onChanged,
}: SubscriptionManagerDialogProps) {
  const planInfo = getPlanInfo(subscription)
  const isManual = !!subscription?.isManual
  const canManage = !!subscription && isManual

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const [editPlan, setEditPlan] = useState<PlanType>((subscription?.planType as PlanType) ?? "TRIAL")
  const [editDate, setEditDate] = useState(toDateInput(subscription?.currentPeriodEnd))

  const [history, setHistory] = useState<SubscriptionEvent[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setError("")
    setEditPlan((subscription?.planType as PlanType) ?? "TRIAL")
    setEditDate(toDateInput(subscription?.currentPeriodEnd))

    setHistoryLoading(true)
    SuppliersService.getSubscriptionHistory(partnerId)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false))
  }, [isOpen, partnerId, subscription])

  const run = async (action: () => Promise<void>, successMsg: string) => {
    setBusy(true)
    setError("")
    try {
      await action()
      const fresh = await SuppliersService.getSubscriptionHistory(partnerId)
      setHistory(fresh)
      await onChanged()
      toast({ title: successMsg })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível concluir a ação.")
    } finally {
      setBusy(false)
    }
  }

  const handleEdit = () =>
    run(
      () =>
        SuppliersService.editSubscription(partnerId, {
          planType: editPlan,
          currentPeriodEnd: editDate ? new Date(editDate).toISOString() : undefined,
        }),
      "Plano atualizado.",
    )

  const handleCancel = () =>
    run(() => SuppliersService.cancelTrial(partnerId), "Plano cancelado.")

  return (
    <AdminDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={`Assinatura · ${partnerName}`}
      description="Veja os detalhes do plano atual, ajuste a vigência e acompanhe o histórico."
      icon={
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
      }
    >
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Detalhes atuais */}
        <section className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Plano atual</h3>
            {planInfo ? (
              <Badge variant="outline" className={TONE_BADGE[planInfo.tone]}>
                {planInfo.statusLabel}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                Sem plano
              </Badge>
            )}
          </div>
          {planInfo ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Plano</dt>
              <dd className="font-medium">{planInfo.planLabel}</dd>
              <dt className="text-muted-foreground">Vigência até</dt>
              <dd className="font-medium">{formatDate(subscription?.currentPeriodEnd)}</dd>
              <dt className="text-muted-foreground">Origem</dt>
              <dd className="font-medium">{isManual ? "Concedido pelo admin" : "Assinatura Stripe"}</dd>
              {planInfo.detail && (
                <>
                  <dt className="text-muted-foreground">Observação</dt>
                  <dd>{planInfo.detail}</dd>
                </>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">Este parceiro ainda não possui uma assinatura.</p>
          )}
        </section>

        {/* Ações — só para planos manuais */}
        {canManage ? (
          <section className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Pencil className="h-4 w-4" /> Editar plano
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Tipo de plano</Label>
                <Select value={editPlan} onValueChange={(v) => setEditPlan(v as PlanType)} disabled={busy}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs" htmlFor="edit-date">
                  Válido até
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  disabled={busy}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleEdit} disabled={busy} className="flex-1">
                Salvar alterações
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleCancel}
                disabled={busy || planInfo?.tone === "canceled"}
              >
                <Ban className="h-4 w-4 mr-1.5" />
                Cancelar plano
              </Button>
            </div>
          </section>
        ) : (
          subscription && (
            <p className="text-sm text-muted-foreground">
              Esta assinatura é da Stripe — edição e cancelamento devem ser feitos pela Stripe.
            </p>
          )
        )}

        {/* Histórico */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <History className="h-4 w-4" /> Histórico
          </div>
          {historyLoading ? (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum evento registrado ainda.</p>
          ) : (
            <ol className="space-y-2">
              {history.map((ev) => (
                <li key={ev.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{EVENT_LABEL[ev.eventType] ?? ev.eventType}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(ev.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ev.planType} · {ev.status} · vigência {formatDate(ev.currentPeriodEnd)} ·{" "}
                    {SOURCE_LABEL[ev.source] ?? ev.source}
                    {ev.note ? ` · ${ev.note}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </AdminDialog>
  )
}
