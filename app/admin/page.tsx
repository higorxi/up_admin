import { AdminLayout } from "@/components/admin-layout";
import { PageTransition } from "@/components/page-transition";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentActivity } from "@/components/recent-activity";
import { ImportantNotices } from "@/components/important-notices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Calendar, Flag, MessageSquareText, Plus, Tags, TicketCheck, UserCheck, Users } from "lucide-react";
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

        <ImportantNotices />

        {/* Content Grid */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Recent Activity - Takes 2 columns */}
          <div>
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Ações Rápidas
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/conexao-premiada">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TicketCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">Conexão Premiada</div>
                    <div className="text-xs text-muted-foreground">
                      Histórico físico
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/lojista-parceiro">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">Aprovar Lojista</div>
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
                <Link href="/admin/crm-profissionais">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">CRM Profissionais</div>
                    <div className="text-xs text-muted-foreground">
                      Ver dados e métricas
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/publicacoes">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquareText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">Publicações</div>
                    <div className="text-xs text-muted-foreground">
                      Criar ou editar
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/comunidades">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tags className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">Comunidades</div>
                    <div className="text-xs text-muted-foreground">
                      Espaços de posts
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/profissoes">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BriefcaseBusiness className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">Profissões</div>
                    <div className="text-xs text-muted-foreground">
                      Cadastro base
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-3 h-12 bg-transparent hover:bg-muted/50 transition-colors"
              >
                <Link href="/admin/denuncias">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Flag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">Denúncias</div>
                    <div className="text-xs text-muted-foreground">
                      Revisar relatos
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
                    <div className="font-medium">Eventos</div>
                    <div className="text-xs text-muted-foreground">
                      Criar evento
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
