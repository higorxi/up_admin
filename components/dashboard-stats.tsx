"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useDashboardStatistics } from "@/hooks/use-dashboard"
import { Users, Calendar, Gift, Clock, Briefcase, Store, Coins, Tags, Flag, Sparkles } from "lucide-react"

export function DashboardStats() {
  const { stats, loading, error } = useDashboardStatistics()

  const dashboardStats = [
    {
      title: "Total de Usuários",
      value: stats ? stats.totalUsers.toLocaleString() : "...",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Cadastrados"
    },
    {
      title: "Total de Profissionais",
      value: stats ? stats.totalProfessionals.toLocaleString() : "...",
      icon: Briefcase,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Ativos"
    },
    {
      title: "Lojistas Parceiros",
      value: stats ? stats.totalPartnerSuppliers.toLocaleString() : "...",
      icon: Store,
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      iconColor: "text-green-600",
      description: `${stats?.pendingPartnerSuppliers ?? 0} pendente(s)`
    },
    {
      title: "Parceiros Wellness",
      value: stats ? stats.totalWellnessPartners.toLocaleString() : "...",
      icon: Sparkles,
      gradient: "from-amber-500 to-amber-600",
      lightBg: "bg-amber-50",
      iconColor: "text-amber-700",
      description: `${stats?.pendingWellnessPartners ?? 0} pendente(s)`
    },
    {
      title: "Eventos Este Mês",
      value: stats ? stats.totalEventsThisMonth.toString() : "...",
      icon: Calendar,
      gradient: "from-orange-500 to-orange-600",
      lightBg: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "Neste mês"
    },
    {
      title: "Prestadores de Serviços",
      value: stats ? stats.totalRecommendedProfessionals.toString() : "...",
      icon: Gift,
      gradient: "from-pink-500 to-pink-600",
      lightBg: "bg-pink-50",
      iconColor: "text-pink-600",
      description: "Recomendados"
    },
    {
      title: "Publicações",
      value: stats ? stats.totalPosts.toLocaleString() : "...",
      icon: Clock,
      gradient: "from-slate-500 to-slate-600",
      lightBg: "bg-slate-50",
      iconColor: "text-slate-600",
      description: `${stats?.postsThisMonth ?? 0} neste mês`
    },
    {
      title: "Total de Vendas Físicas",
      value: stats ? stats.totalPhysicalSales.toLocaleString() : "...",
      icon: Store,
      gradient: "from-indigo-500 to-indigo-600",
      lightBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      description: "Códigos gerados"
    },
    {
      title: "Pontos Distribuídos (Físico)",
      value: stats ? stats.totalPointsAwardedPhysical.toLocaleString() : "...",
      icon: Coins,
      gradient: "from-emerald-500 to-emerald-600",
      lightBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Já resgatados"
    },
    {
      title: "Profissões",
      value: stats ? stats.totalProfessions.toLocaleString() : "...",
      icon: Briefcase,
      gradient: "from-cyan-500 to-cyan-600",
      lightBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      description: "Categorias"
    },
    {
      title: "Comunidades",
      value: stats ? stats.totalCommunities.toLocaleString() : "...",
      icon: Tags,
      gradient: "from-violet-500 to-violet-600",
      lightBg: "bg-violet-50",
      iconColor: "text-violet-600",
      description: "Espaços ativos"
    },
    {
      title: "Denúncias",
      value: stats ? stats.totalReports.toLocaleString() : "...",
      icon: Flag,
      gradient: "from-red-500 to-red-600",
      lightBg: "bg-red-50",
      iconColor: "text-red-600",
      description: "Para revisar"
    },
  ]

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800 text-sm font-medium">
          Erro ao carregar estatísticas: {error}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {loading
        ? Array.from({ length: 12 }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden border shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-24" />
                    <div className="h-7 bg-slate-200 rounded animate-pulse w-16" />
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-slate-200 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))
        : dashboardStats.map((stat, index) => (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle className="truncate text-xs font-medium text-slate-600 transition-colors group-hover:text-slate-900 md:text-sm">
                      {stat.title}
                    </CardTitle>
                    <div className="text-2xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </div>
                    <p className="truncate text-xs text-slate-500">{stat.description}</p>
                  </div>
                  <div className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${stat.lightBg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} strokeWidth={2} />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}
