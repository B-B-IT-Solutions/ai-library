import { headers } from "next/headers";

import { UserRepository } from "@/data/repositories/user";
import { CartService } from "@/data/services//cart";
import { OrderService } from "@/data/services//order";
import {
   IubendaService,
   LegalNoticesAcceptedParams,
} from "@/data/services/iubenda";
import { VerificationTokenService } from "@/data/services/user";
import { UserUpdateData } from "@/data/types/db/user";
import {
   DUser,
   DUserAccountDelete,
   DUserCreate,
   DUserPasswordUpdate,
   DUserSignIn,
   DUserSignUp,
   DUserUpdate,
} from "@/data/types/domain/user";
import { compare, hash } from "@/lib/encrypt";
import { resolveIpAddresse } from "@/lib/utils";

import { toDUser } from "./user.mapper";

export class UserService {
   constructor(
      private readonly userRepository: UserRepository,
      private readonly verificationTokenService: VerificationTokenService,
      private readonly cartService: CartService,
      private readonly orderService: OrderService,
      private readonly iubendaService: IubendaService
   ) {}

   async signUpUser(data: DUserSignUp): Promise<DUser> {
      const hashedPassword = await hash(data.password);
      const legalNoticesAcceptedAt = new Date();

      const newUser: DUserCreate = {
         name: data.name,
         email: data.email,
         hashedPassword: hashedPassword,
         legalNoticesAcceptedAt,
      };

      const user = await this.userRepository.pCreateUser(newUser);
      this.saveLegalNoticesAccepted(user, legalNoticesAcceptedAt);
      this.verificationTokenService
         .sendVerificationEmail(user.email, user.name)
         .catch((err) =>
            console.error(
               `[UserService] Failed to send verification email to ${user.email}:`,
               err
            )
         );

      return toDUser(user);
   }

   async singInUser(data: DUserSignIn) {
      const user = await this.userRepository.pGetUserByEmail(data.email);
      if (user && user.password) {
         const isMatch = await compare(data.password, user.password);

         if (isMatch && user.emailVerified) {
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

   async getUserByEmail(email: string): Promise<DUser | null> {
      const user = await this.userRepository.pGetUserByEmail(email);
      if (user) {
         return toDUser(user);
      }
      return null;
   }

   async getUserStripeCustomerId(userId: string): Promise<string | null> {
      const user = await this.userRepository.pGetUserById(userId);
      if (user && user.stripeCustomerId) {
         return user.stripeCustomerId;
      }
      return null;
   }

   async updateUser(userId: string, data: DUserUpdate) {
      const updateData: UserUpdateData = {
         name: data.name,
      };
      await this.userRepository.pUpdateUser(userId, updateData);
   }

   async updateUserStripeCustomerId(userId: string, stripeCustomerId: string) {
      const updateData: UserUpdateData = {
         stripeCustomerId,
      };
      await this.userRepository.pUpdateUser(userId, updateData);
   }

   async updateIubendaLegalNoticesSynced(userId: string, synced: boolean) {
      const updateData: UserUpdateData = {
         iubendaLegalNoticesSynced: synced,
      };
      await this.userRepository.pUpdateUser(userId, updateData);
   }

   async updatePassword(userId: string, data: DUserPasswordUpdate) {
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

   async deleteUser(userId: string, data: DUserAccountDelete) {
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
      await this.cartService.deleteCarts(userId);
      await this.orderService.deleteOrders(userId);
      await this.userRepository.pDeleteUser(userId);
   }

   async saveLegalNoticesAccepted(user: DUser, acceptedAt: Date) {
      const headersList = await headers();
      const ipAddress = resolveIpAddresse(headersList);

      const params: LegalNoticesAcceptedParams = {
         user,
         acceptedAt,
         ipAddress,
      };

      this.iubendaService.saveLegalNoticesAccepted(params).then((synced) => {
         if (synced) {
            this.updateIubendaLegalNoticesSynced(user.id, true);
         }
      });
   }

   async isEmailVerified(email: string): Promise<boolean | null> {
      return await this.userRepository.pGetEmailVerified(email);
   }

   async verifyEmail(email: string): Promise<void> {
      await this.userRepository.pVerifyUserEmail(email);
   }
}
