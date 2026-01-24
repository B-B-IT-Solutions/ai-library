import { UserRepository } from "@/data/repositories/user";
import {
   DUser,
   DUserAccountDelete,
   DUserPasswordUpdate,
   DUserSignIn,
   DUserSignUp,
   DUserUpdateData,
} from "@/data/types/domain/user";
import { UserCreateInput } from "@/generated/prisma/models";
import { compare, hash } from "@/lib/encrypt";
import { CartService } from "../cart";

import { toDUser } from "./user.mapper";

export class UserService {
   private userRepository: UserRepository;
   private cartService: CartService;

   constructor(userRepository: UserRepository, cartService: CartService) {
      this.userRepository = userRepository;
      this.cartService = cartService;
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

   async singInUser(data: DUserSignIn) {
      const user = await this.userRepository.pGetUserByEmail(data.email);
      if (user && user.password) {
         const isMatch = await compare(data.password, user.password);

         if (isMatch) {
            return {
               id: user.id,
               name: user.name,
               email: user.email,
               role: user.role,
            };
         }
      }
      return null;
   }

   async getUserById(userId: string): Promise<DUser | null> {
      const user = await this.userRepository.pGetUserById(userId);
      if (user) {
         return toDUser(user);
      }
      return null;
   }

   async updateUser(userId: string, data: DUserUpdateData): Promise<void> {
      await this.userRepository.pUpdateUser(userId, data);
   }

   async updatePassword(
      userId: string,
      data: DUserPasswordUpdate
   ): Promise<void> {
      const user = await this.userRepository.pGetUserById(userId);
      if (!user) {
         throw new Error("User not found");
      }

      if (!user.password) {
         // e.g. when using google login
         throw new Error("User doesn't have a password");
      }

      const isPasswordValid = await compare(
         data.currentPassword,
         user.password
      );
      if (!isPasswordValid) {
         throw new Error("Password cannot be updated");
      }

      const hashedPassword = await hash(data.newPassword);

      await this.userRepository.pUpdatePassword(userId, hashedPassword);
   }

   async deleteUser(userId: string, data: DUserAccountDelete): Promise<void> {
      const user = await this.userRepository.pGetUserById(userId);
      if (!user) {
         throw new Error("User not found");
      }

      if (!user.password) {
         // e.g. when using google login
         throw new Error("User doesn't have a password");
      }

      const isPasswordValid = await compare(data.password, user.password);
      if (!isPasswordValid) {
         throw new Error("Account cannot be deleted");
      }

      // Hard delete user and all related data
      await this.userRepository.pHardDeleteUser(userId);
   }
}
