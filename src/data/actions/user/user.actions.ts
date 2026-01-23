"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut } from "@/auth";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DUser,
   DUserSignIn,
   DUserSignUp,
   DUserUpdateData,
} from "@/data/types/domain/user";
import { signInSchema, signUpSchema } from "@/data/types/validators/user";
import { User } from "@/generated/prisma/client";

export const signUpUser = async (data: DUserSignUp) => {
   try {
      const validatedData: DUserSignUp = signUpSchema.parse(data);

      const service = getUserService();
      await service.signUpUser(validatedData);

      await signIn("credentials", {
         email: data.email,
         password: data.password,
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

export const signInWithCredentials = async (data: DUserSignIn) => {
   try {
      const singInValues = signInSchema.parse(data);
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

export const getUserById = async (userId: string): Promise<DUser> => {
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
