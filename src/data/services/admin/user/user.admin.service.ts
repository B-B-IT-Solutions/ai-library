import { AdminUserRepository } from "@/data/repositories/admin/user";
import {
   DAdminUser,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/user";
import { DUserRole } from "@/data/types/domain/user";

export class AdminUserService {
   constructor(private readonly userRepository: AdminUserRepository) {}

   async getUsersPage(query?: DAdminUsersPageQuery): Promise<DAdminUsersPage> {
      return await this.userRepository.pGetUsersPage(query);
   }

   async getUser(userId: string): Promise<DAdminUser | null> {
      return await this.userRepository.pGetUser(userId);
   }

   async updateUserRole(userId: string, role: DUserRole): Promise<void> {
      await this.userRepository.pUpdateUserRole(userId, role);
   }
}
