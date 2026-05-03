import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const token = searchParams.get("token");
   const email = searchParams.get("email");

   if (!token || !email) {
      redirect("/auth/sign-in?error=invalid_link");
   }

   const factory = new ServiceFactory(prisma);
   const tokenService = factory.getVerificationTokenService();
   const isValid = await tokenService.verifyToken(email, token);

   if (!isValid) {
      redirect("/auth/sign-in?error=expired_link");
   }

   const userService = factory.getUserService();
   await userService.verifyEmail(email);

   redirect("/auth/sign-in?verified=true");
}
