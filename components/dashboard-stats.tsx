import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Calendar, Gift, TrendingUp, Clock } from "lucide-react"

const stats = [
  {
    title: "Total de Usuários",
    value: "2,847",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Fornecedores Ativos",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: UserCheck,
  },
  {
    title: "Eventos Este Mês",
    value: "23",
    change: "+15%",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Benefícios Resgatados",
    value: "1,234",
    change: "+22%",
    changeType: "positive" as const,
    icon: Gift,
  },
  {
    title: "Aprovações Pendentes",
    value: "18",
    change: "-5%",
    changeType: "negative" as const,
    icon: Clock,
  },
  {
    title: "Taxa de Engajamento",
    value: "87%",
    change: "+3%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
              {stat.change} em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
