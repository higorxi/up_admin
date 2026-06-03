import { ApiService } from "./api";
export interface DashboardStatistics {
  totalUsers: number;
  totalProfessionals: number;
  totalPartnerSuppliers: number;
  totalWellnessPartners: number;
  totalEventsThisMonth: number;
  totalRecommendedProfessionals: number;
  totalPosts: number;
  totalPhysicalSales: number;
  totalPointsAwardedPhysical: number;
  totalProfessions: number;
  totalCommunities: number;
  totalReports: number;
  pendingPartnerSuppliers: number;
  pendingWellnessPartners: number;
  pendingBenefitRedemptions: number;
  postsThisMonth: number;
}

export interface RecentActivity {
  id: string;
  type: 'User' | 'Professional' | 'Post';
  description: string;
  date: Date;
  status?: 'pending' | 'completed' | 'approved';
}


export class DashboardService {
  static async getStatistics(): Promise<DashboardStatistics> {
    return ApiService.get<DashboardStatistics>("/dashboard/statistics");
  }

  static async getRecentActivities(): Promise<RecentActivity[]> {
    return ApiService.get<RecentActivity[]>("/dashboard/recent-activities");
  }
}
