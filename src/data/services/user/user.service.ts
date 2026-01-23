import { UserRepository } from "@/data/repositories/user";
import {
   DUser,
   DUserPasswordUpdate,
   DUserSignUp,
   DUserUpdateData,
} from "@/data/types/domain/user";
import { UserCreateInput } from "@/generated/prisma/models";
import { compare, hash } from "@/lib/encrypt";

import { toDUser } from "./user.mapper";

export class UserService {
   private userRepository: UserRepository;

   constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
   }

   async signUpUser(data: DUserSignUp): Promise<DUser> {
      const hashedPassword = await hash(data.password);

      const newUser: UserCreateInput = {
         name: data.name,
         email: data.email,
         password: hashedPassword,
      };
      const createdUser = await this.userRepository.pCreateUser(newUser);
      return toDUser(createdUser);
   }

   async getUserById(userId: string): Promise<DUser | null> {
      const user = await this.userRepository.pGetUserById(userId);
      if (user) {
         return toDUser(user);
      }
      return null;
   }

   async getUserByEmail(email: string): Promise<DUser | null> {
      const user = await this.userRepository.pGetUserByEmail(email);
      if (user) {
         return toDUser(user);
      }
      return null;
   }

   async updateUser(userId: string, data: DUserUpdateData): Promise<void> {
      await this.userRepository.pUpdateUser(userId, data);
   }

   async changePassword(
      userId: string,
      data: DUserPasswordUpdate
   ): Promise<void> {
      const user = await this.userRepository.pGetUserById(userId);
      if (!user) {
         throw new Error("Benutzer nicht gefunden");
      }

      if (!user.password) {
         // e.g. when using google login
         throw new Error("Benutzer hat kein Passwort");
      }

      const isPasswordValid = await compare(
         data.currentPassword,
         user.password
      );
      if (!isPasswordValid) {
         throw new Error("Aktuelles Passwort ist falsch");
      }

      const hashedPassword = await hash(data.newPassword);

      await this.userRepository.pChangePassword(userId, hashedPassword);
   }

   async deleteAccount(userId: string, password: string): Promise<void> {
      const user = await this.userRepository.pGetUserById(userId);
      if (!user) {
         throw new Error("Benutzer nicht gefunden");
      }

      if (!user.password) {
         // e.g. when using google login
         throw new Error("Benutzer hat kein Passwort");
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
         throw new Error("Passwort ist falsch");
      }

      // Hard delete user and all related data
      await this.userRepository.pHardDeleteUser(userId);
   }
}
