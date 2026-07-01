"use server";

import { auth } from "@/auth";
import { LoginUser } from "@/data/types/next-auth";

import { AiLibAuthenticationError } from "./types";

export const requireAdmin = async (): Promise<LoginUser> => {
   const session = await auth();
   if (!session?.user?.id) {
      throw new AiLibAuthenticationError("Authentication required");
   }
   if (session.user.role !== "ADMIN") {
      throw new AiLibAuthenticationError("Forbidden");
   }

   const admin: LoginUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
   };
   return admin;
};

export const requireUser = async (): Promise<LoginUser> => {
   const session = await auth();
   if (!session?.user?.id) {
      throw new AiLibAuthenticationError("Authentication required");
   }

   const user: LoginUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
   };

   return user;
};

export const isAuthenticated = async (): Promise<boolean> => {
   try {
      await requireUser();
      return true;
   } catch {
      return false;
   }
};
