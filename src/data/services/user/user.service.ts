import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import * as userRepository from "@/data/repositories/user/user";
import { ActionResult } from "@/data/types/utils";
import { User } from "@/generated/prisma/client";
import { compare, hash } from "@/lib/encrypt";

export class UserService {
   async updateProfile(name: string): Promise<User> {
      const loginUser = await requireUser();
      return await userRepository.updateUser(loginUser.id, { name });
   }

   async changePassword(
      userId: string,
      currentPassword: string,
      newPassword: string
   ): Promise<ActionResult> {
      try {
         // Get user
         const user = await userRepository.getUserById(userId);
         if (!user) {
            return {
               success: false,
               message: "Benutzer nicht gefunden",
            };
         }

         // Verify current password
         const isPasswordValid = await compare(currentPassword, user.password);
         if (!isPasswordValid) {
            return {
               success: false,
               message: "Aktuelles Passwort ist falsch",
            };
         }

         // Check if new password is different from current
         if (currentPassword === newPassword) {
            return {
               success: false,
               message: "Neues Passwort muss sich vom aktuellen unterscheiden",
            };
         }

         // Hash new password
         const hashedPassword = await hash(newPassword);

         // Update password
         await userRepository.changePassword(userId, hashedPassword);

         return {
            success: true,
            message: "Passwort erfolgreich geändert",
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }

   async deleteAccount(
      userId: string,
      password: string
   ): Promise<ActionResult> {
      try {
         // Get user
         const user = await userRepository.getUserById(userId);
         if (!user) {
            return {
               success: false,
               message: "Benutzer nicht gefunden",
            };
         }

         // Verify password
         const isPasswordValid = await compare(password, user.password);
         if (!isPasswordValid) {
            return {
               success: false,
               message: "Passwort ist falsch",
            };
         }

         // Hard delete user and all related data
         await userRepository.hardDeleteUser(userId);

         return {
            success: true,
            message: "Konto wurde gelöscht",
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }
}
