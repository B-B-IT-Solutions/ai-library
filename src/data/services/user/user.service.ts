import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import { UserRepository } from "@/data/repositories/user";
import { DUserUpdateData } from "@/data/types/domain/user";
import { ActionResult } from "@/data/types/utils";
import { Prisma, User } from "@/generated/prisma/client";
import { compare, hash } from "@/lib/encrypt";

export class UserService {
   private userRepository: UserRepository;

   constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
   }

   async signUpUser(
      name: string,
      email: string,
      password: string
   ): Promise<ActionResult<{ user: User; plainPassword: string }>> {
      try {
         const hashedPassword = await hash(password);

         const newUser: Prisma.UserCreateInput = {
            name,
            email,
            password: hashedPassword,
         };

         const user = await this.userRepository.pCreateUser(newUser);

         return {
            success: true,
            message: "User registered successfully",
            data: {
               user,
               plainPassword: password,
            },
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }

   async getUserById(userId: string): Promise<User> {
      const user = await this.userRepository.pGetUserById(userId);
      if (!user) {
         throw new Error("User not found");
      }
      return user;
   }

   async getUserByEmail(email: string): Promise<User | null> {
      return await this.userRepository.pGetUserByEmail(email);
   }

   async updateUser(userId: string, data: DUserUpdateData): Promise<void> {
      await this.userRepository.pUpdateUser(userId, data);
   }

   async updateProfile(name: string): Promise<User> {
      const loginUser = await requireUser();
      return await this.userRepository.pUpdateUser(loginUser.id, { name });
   }

   async changePassword(
      userId: string,
      currentPassword: string,
      newPassword: string
   ): Promise<ActionResult> {
      try {
         // Get user
         const user = await this.userRepository.pGetUserById(userId);
         if (!user) {
            return {
               success: false,
               message: "Benutzer nicht gefunden",
            };
         }

         // Check if user has a password
         if (!user.password) {
            return {
               success: false,
               message: "Benutzer hat kein Passwort",
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
         await this.userRepository.pChangePassword(userId, hashedPassword);

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
         const user = await this.userRepository.pGetUserById(userId);
         if (!user) {
            return {
               success: false,
               message: "Benutzer nicht gefunden",
            };
         }

         // Check if user has a password
         if (!user.password) {
            return {
               success: false,
               message: "Benutzer hat kein Passwort",
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
         await this.userRepository.pHardDeleteUser(userId);

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
