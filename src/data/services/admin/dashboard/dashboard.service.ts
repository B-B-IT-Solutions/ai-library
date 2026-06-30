import { AdminDashboardRepository } from "@/data/repositories/admin/dashboard";
import { DAdminStats } from "@/data/types/domain/admin/stats";

export class AdminDashboardService {
   constructor(private dashboardRepository: AdminDashboardRepository) {}

   async getStats(): Promise<DAdminStats> {
      return await this.dashboardRepository.pGetStats();
   }
}
