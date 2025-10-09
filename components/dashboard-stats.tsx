"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardStatistics } from "@/hooks/use-dashboard"
import { Users, UserCheck, Calendar, Gift, Clock, Briefcase, TrendingUp, ArrowUpRight } from "lucide-react"

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
      description: "Usuários cadastrados"
    },
    {
      title: "Total de Profissionais",
      value: stats ? stats.totalProfessionals.toLocaleString() : "...",
      icon: Briefcase,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Profissionais ativos"
    },
    {
      title: "Fornecedores Ativos",
      value: stats ? stats.totalPartnerSuppliers.toLocaleString() : "...",
      icon: UserCheck,
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      iconColor: "text-green-600",
      description: "Parceiros verificados"
    },
    {
      title: "Eventos Este Mês",
      value: stats ? stats.totalEventsThisMonth.toString() : "...",
      icon: Calendar,
      gradient: "from-amber-500 to-amber-600",
      lightBg: "bg-amber-50",
      iconColor: "text-amber-600",
      description: "Eventos planejados"
    },
    {
      title: "Profissionais Recomendados",
      value: stats ? stats.totalRecommendedProfessionals.toString() : "...",
      icon: Gift,
      gradient: "from-pink-500 to-pink-600",
      lightBg: "bg-pink-50",
      iconColor: "text-pink-600",
      description: "Recomendações ativas"
    },
    {
      title: "Posts Publicados",
      value: stats ? stats.totalPosts.toLocaleString() : "...",
      icon: Clock,
      gradient: "from-slate-500 to-slate-600",
      lightBg: "bg-slate-50",
      iconColor: "text-slate-600",
      description: "Conteúdo criado"
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
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden border-0 shadow-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
                    <div className="h-8 bg-slate-200 rounded animate-pulse w-20" />
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse" />
                </div>
                <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
              </CardContent>
            </Card>
          ))
        : dashboardStats.map((stat, index) => (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {stat.title}
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                  <div className={`relative flex items-center justify-center h-12 w-12 rounded-xl ${stat.lightBg} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} strokeWidth={2} />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  {stat.description}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}