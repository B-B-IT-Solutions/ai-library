import { AdminUserRepository } from "@/data/repositories/admin";
import {
   DAdminUserDetail,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/admin";

export class AdminUserService {
   constructor(private readonly repo: AdminUserRepository) {}

   async getUsersPage(query?: DAdminUsersPageQuery): Promise<DAdminUsersPage> {
      return await this.repo.pGetUsersPage(query);
   }

   async getUserDetail(userId: string): Promise<DAdminUserDetail | null> {
      return await this.repo.pGetUserDetail(userId);
   }

   async updateUserRole(userId: string, role: string): Promise<void> {
      await this.repo.pUpdateUserRole(userId, role);
   }
}
