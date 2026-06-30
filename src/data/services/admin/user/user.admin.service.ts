import { AdminUserRepository } from "@/data/repositories/admin/user";
import {
   DAdminUser,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/user";

export class AdminUserService {
   constructor(private readonly userRepository: AdminUserRepository) {}

   async getUsersPage(query?: DAdminUsersPageQuery): Promise<DAdminUsersPage> {
      return await this.userRepository.pGetUsersPage(query);
   }

   async getUser(userId: string): Promise<DAdminUser | null> {
      return await this.userRepository.pGetUser(userId);
   }

   async updateUserRole(userId: string, role: string): Promise<void> {
      await this.userRepository.pUpdateUserRole(userId, role);
   }
}
