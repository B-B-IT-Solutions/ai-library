"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut } from "@/auth";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DSignInFormData,
   DSignUpFormData,
   DUserUpdateData,
} from "@/data/types/domain/user";
import {
   signInFormSchema,
   signUpFormSchema,
} from "@/data/types/validators/user.schema";
import { User } from "@/generated/prisma/client";

export const signInWithCredentials = async (formData: DSignInFormData) => {
   try {
      const singInValues = signInFormSchema.parse(formData);
      await signIn("credentials", singInValues);
      return {
         success: true,
         message: "Signed in successfully",
      };
   } catch (error) {
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: "Invalid email or password",
      };
   }
};

export const signOutUser = async () => {
   await signOut({ redirectTo: "/p" });
};

export const signUpUser = async (formData: DSignUpFormData) => {
   try {
      const singUpValues = signUpFormSchema.parse(formData);

      const service = getUserService();
      const result = await service.signUpUser(
         singUpValues.name,
         singUpValues.email,
         singUpValues.password
      );

      if (!result.success || !result.data) {
         return result;
      }

      await signIn("credentials", {
         email: formData.email,
         password: formData.password,
      });

      return {
         success: true,
         message: "User registered successfully",
      };
   } catch (error) {
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const getUserById = async (userId: string): Promise<User> => {
   const service = getUserService();
   return service.getUserById(userId);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
   const service = getUserService();
   return service.getUserByEmail(email);
};

export const updateUser = async (
   userId: string,
   data: DUserUpdateData
): Promise<void> => {
   const service = getUserService();
   return service.updateUser(userId, data);
};

const getUserService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getUserService();
};
