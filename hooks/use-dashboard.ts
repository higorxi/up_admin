"use client"

import { useState, useEffect } from "react"
import { DashboardService, DashboardStatistics, RecentActivity } from "@/lib/services/dashboard"

export function useDashboardStatistics() {
  const [stats, setStats] = useState<DashboardStatistics | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, activitiesData] = await Promise.all([
        DashboardService.getStatistics(),
        DashboardService.getRecentActivities(),
      ])

      setStats(statsData)
      setActivities(activitiesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar estatísticas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  return { stats, activities, loading, error, refetch: fetchStatistics }
}
