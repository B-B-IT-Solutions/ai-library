"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginUser } from "@/data/types/next-auth";

export const requireUser = async (): Promise<LoginUser> => {
   const session = await auth();
   if (!session?.user?.id) {
      throw new Error("Authentication required");
   }
   return {
      id: session.user.id,
      email: session.user.email,
   };
};

export const requireAuthServer = async () => {
   const authenticated = await isAuthenticated();
   if (!authenticated) {
      redirect("/auth/sign-in");
   }
};

export const isAuthenticated = async (): Promise<boolean> => {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return false;
      }
      return true;
   } catch {
      return false;
   }
};
