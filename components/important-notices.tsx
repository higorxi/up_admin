"use client"

import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useDashboardStatistics } from "@/hooks/use-dashboard"
import { AlertTriangle, CheckCircle2, Flag, Gift, UserCheck } from "lucide-react"

export function ImportantNotices() {
  const { stats, loading, error } = useDashboardStatistics()

  if (loading) {
    return (
      <div className="grid gap-3 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-lg border bg-muted/40" />
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  const notices = [
    {
      show: stats.totalReports > 0,
      title: `${stats.totalReports} denúncia${stats.totalReports === 1 ? "" : "s"} para revisar`,
      description: "Veja os relatos antes de tomar uma ação sobre o conteúdo.",
      href: "/admin/denuncias",
      action: "Ver denúncias",
      icon: Flag,
      tone: "border-red-200 bg-red-50 text-red-900",
    },
    {
      show: stats.pendingPartnerSuppliers > 0,
      title: `${stats.pendingPartnerSuppliers} lojista${stats.pendingPartnerSuppliers === 1 ? "" : "s"} pendente${stats.pendingPartnerSuppliers === 1 ? "" : "s"}`,
      description: "Aprove ou rejeite solicitações de cadastro.",
      href: "/admin/lojista-parceiro",
      action: "Ver lojistas",
      icon: UserCheck,
      tone: "border-amber-200 bg-amber-50 text-amber-900",
    },
    {
      show: stats.pendingBenefitRedemptions > 0,
      title: `${stats.pendingBenefitRedemptions} resgate${stats.pendingBenefitRedemptions === 1 ? "" : "s"} pendente${stats.pendingBenefitRedemptions === 1 ? "" : "s"}`,
      description: "Confira benefícios aguardando validação.",
      href: "/admin/beneficios",
      action: "Ver benefícios",
      icon: Gift,
      tone: "border-blue-200 bg-blue-50 text-blue-900",
    },
  ].filter((notice) => notice.show)

  if (notices.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50 text-green-900">
        <CheckCircle2 className="h-5 w-5" />
        <AlertDescription className="flex flex-col gap-1 text-base sm:flex-row sm:items-center sm:justify-between">
          <span>Nenhum aviso importante no momento. As principais pendências estão em dia.</span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {notices.map((notice) => {
        const Icon = notice.icon

        return (
          <Alert key={notice.href} className={notice.tone}>
            <Icon className="h-5 w-5" />
            <AlertDescription className="space-y-3">
              <div>
                <p className="text-base font-semibold">{notice.title}</p>
                <p className="text-sm opacity-80">{notice.description}</p>
              </div>
              <Button asChild size="sm" variant="outline" className="h-9 bg-white/70">
                <Link href={notice.href}>{notice.action}</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
