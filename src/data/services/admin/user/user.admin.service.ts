import { AdminUserRepository } from "@/data/repositories/admin/user";
import {
   DAdminUserDetail,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/admin";

export class AdminUserService {
   constructor(private readonly userRepository: AdminUserRepository) {}

   async getUsersPage(query?: DAdminUsersPageQuery): Promise<DAdminUsersPage> {
      return await this.userRepository.pGetUsersPage(query);
   }

   async getUserDetail(userId: string): Promise<DAdminUserDetail | null> {
      return await this.userRepository.pGetUserDetail(userId);
   }

   async updateUserRole(userId: string, role: string): Promise<void> {
      await this.userRepository.pUpdateUserRole(userId, role);
   }
}
