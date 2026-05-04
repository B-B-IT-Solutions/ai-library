import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const token = searchParams.get("token");
   const email = searchParams.get("email");

   if (!token || !email) {
      return redirect("/auth/sign-in?error=invalid_link");
   }

   const tokenService = getTokenService();
   const isValid = await tokenService.verifyToken(email, token);

   if (!isValid) {
      return redirect("/auth/sign-in?error=expired_link");
   }

   const userService = getUserService();
   await userService.verifyEmail(email);

   redirect("/auth/sign-in?verified=true");
}

const getTokenService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getVerificationTokenService();
};

const getUserService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getUserService();
};
