"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboardStatistics } from "@/hooks/use-dashboard"

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>
    case "completed":
      return <Badge variant="outline" className="text-green-600 border-green-600">Concluído</Badge>
    case "approved":
      return <Badge variant="outline" className="text-blue-600 border-blue-600">Aprovado</Badge>
    default:
      return <Badge variant="outline">Desconhecido</Badge>
  }
}

export function RecentActivity() {
  const { activities, loading } = useDashboardStatistics()

  const skeletonRows = Array.from({ length: 5 })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading
            ? skeletonRows.map((_, index) => (
                <div key={index} className="flex items-center gap-4 animate-pulse">
                  <div className="h-9 w-9 rounded-full bg-gray-300" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-1/3 rounded bg-gray-300" />
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="h-5 w-20 rounded bg-gray-300" />
                    <div className="h-3 w-16 rounded bg-gray-200" />
                  </div>
                </div>
              ))
            : activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {activity.description
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-card-foreground">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(activity.status)}
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
