"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboardStatistics } from "@/hooks/use-dashboard"

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="text-yellow-700 border-yellow-500 bg-yellow-50 font-medium">Pendente</Badge>
    case "completed":
      return <Badge variant="outline" className="text-green-700 border-green-500 bg-green-50 font-medium">Concluído</Badge>
    case "approved":
      return <Badge variant="outline" className="text-blue-700 border-blue-500 bg-blue-50 font-medium">Aprovado</Badge>
    default:
      return <Badge variant="outline" className="text-gray-700 border-gray-500 bg-gray-50 font-medium">Desconhecido</Badge>
  }
}

export function RecentActivity() {
  const { activities, loading } = useDashboardStatistics()

  const skeletonRows = Array.from({ length: 5 })

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-card-foreground font-semibold">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading
            ? skeletonRows.map((_, index) => (
                <div key={index} className="flex items-center gap-4 animate-pulse p-3 rounded-lg bg-muted/30">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted/70" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-6 w-20 rounded-full bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted/70" />
                  </div>
                </div>
              ))
            : activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                      {activity.description
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{activity.type}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    {getStatusBadge(activity.status)}
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
