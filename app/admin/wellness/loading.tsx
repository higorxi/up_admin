import { CardSkeleton } from "@/components/card-skeleton"
import { AdminLayout } from "@/components/admin-layout"
import { AdminPageLayout } from "@/components/admin-page-layout"

export default function WellnessLoading() {
  return (
    <AdminLayout>
      <AdminPageLayout title="Parceiros Wellness" description="Carregando cadastros wellness">
        <CardSkeleton count={6} />
      </AdminPageLayout>
    </AdminLayout>
  )
}
