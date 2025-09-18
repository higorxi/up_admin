import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "João Silva",
    action: "solicitou aprovação como fornecedor",
    time: "2 horas atrás",
    status: "pending",
  },
  {
    id: 2,
    user: "Maria Santos",
    action: "resgatou benefício Premium",
    time: "4 horas atrás",
    status: "completed",
  },
  {
    id: 3,
    user: "Carlos Oliveira",
    action: "se inscreveu no evento Workshop Design",
    time: "6 horas atrás",
    status: "completed",
  },
  {
    id: 4,
    user: "Ana Costa",
    action: "foi aprovada como profissional recomendada",
    time: "1 dia atrás",
    status: "approved",
  },
  {
    id: 5,
    user: "Pedro Lima",
    action: "criou novo evento Networking",
    time: "2 dias atrás",
    status: "completed",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Pendente
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          Concluído
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          Aprovado
        </Badge>
      )
    default:
      return <Badge variant="outline">Desconhecido</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-card-foreground">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getStatusBadge(activity.status)}
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
