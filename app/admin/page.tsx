import { AdminLayout } from "@/components/admin-layout";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentActivity } from "@/components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do sistema UPConnection
            </p>
          </div>
          <span className="text-sidebar-accent-foreground font-bold text-sm bg-red-500 p-2 rounded-2xl">
            UP
          </span>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Ações Rápidas
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent"
              >
                <Link href="/admin/fornecedores">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Aprovar Fornecedores</div>
                    <div className="text-xs text-muted-foreground">
                    Ver solicitações
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent"
              >
                <Link href="/admin/eventos">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Criar Evento</div>
                    <div className="text-xs text-muted-foreground">
                      Novo evento
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent"
              >
                <Link href="/admin/profissionais">
                  <Plus className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Adicionar Profissional</div>
                    <div className="text-xs text-muted-foreground">
                      Recomendado
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
