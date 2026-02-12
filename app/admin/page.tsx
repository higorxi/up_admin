import { AdminLayout } from "@/components/admin-layout";
import { PageTransition } from "@/components/page-transition";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentActivity } from "@/components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <PageTransition>
        <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do sistema UPConnection
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">UP</span>
          </div>
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

            <CardContent className="space-y-2.5">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/fornecedores">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
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
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/eventos">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
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
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/profissionais">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
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
      </PageTransition>
    </AdminLayout>
  );
}
