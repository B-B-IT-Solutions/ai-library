"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut } from "@/auth";
import {
   createUser,
   getUserByEmail as pGetUserByEmail,
   getUserById as pGetUserById,
   updateUser as pUpdateUser,
} from "@/data/repositories/user";
import {
   DSignInFormData,
   DSignUpFormData,
   DUserUpdateData,
} from "@/data/types/domain/user";
import {
   signInFormSchema,
   signUpFormSchema,
} from "@/data/types/validators/user.schema";
import { Prisma } from "@/generated/prisma/client";
import { hash } from "@/lib/encrypt";
import { formatError } from "../utils";

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
      const plainPassword = singUpValues.password;
      singUpValues.password = await hash(singUpValues.password);

      const newUser: Prisma.UserCreateInput = {
         name: singUpValues.name,
         email: singUpValues.email,
         password: singUpValues.password,
      };

      await createUser(newUser);

      await signIn("credentials", {
         email: singUpValues.email,
         password: plainPassword,
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

export const getUserById = async (userId: string) => {
   const user = await pGetUserById(userId);
   if (!user) {
      throw new Error("User not found");
   }
   return user;
};

export const getUserByEmail = async (email: string) => {
   const user = await pGetUserByEmail(email);
   if (!user) {
      return null;
   }
   return user;
};

export const updateUser = async (userId: string, data: DUserUpdateData) => {
   await pUpdateUser(userId, data);
};
