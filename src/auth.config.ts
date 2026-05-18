import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { migrateSessionCartToUser } from "@/data/actions/cart";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DUserSignIn, DUserUpdate } from "@/data/types/domain/user";

export const authConfig: NextAuthConfig = {
   pages: {
      signIn: "/auth/sign-in",
      error: "/auth/sign-in",
   },
   session: {
      strategy: "jwt" as const,
      maxAge: 30 * 24 * 60 * 60, // 30 days
   },
   adapter: PrismaAdapter(prisma),
   providers: [
      CredentialsProvider({
         credentials: {
            email: { type: "email" },
            password: { type: "password" },
         },
         async authorize(credentials) {
            if (credentials == null) {
               return null;
            }

            const data: DUserSignIn = {
               email: credentials.email as string,
               password: credentials.password as string,
            };

            const userService = getUserService();
            return await userService.singInUser(data);
         },
      }),
   ],
   callbacks: {
      authorized({ request, auth }) {
         // Array of regex patterns of paths we want to protect
         const protectedPaths = [
            /\/prompts/,
            /^\/marketplace/,
            /\/products\/(.*)/,
            /^\/templates/,
            /\/checkout/,
            /\/orders\/(.*)/,
            /\/profile/,
            /\/user\/(.*)/,
            /\/settings/,
            /\/admin/,
         ];

         // Get pathname from the req URL object
         const { pathname } = request.nextUrl;

         // Build forwarded headers — always include x-pathname so Server
         // Components (e.g. the authenticated layout) can read the current route
         // without needing a separate headers() call that is unavailable at the edge runtime.
         const requestHeaders = new Headers(request.headers);
         requestHeaders.set("x-pathname", pathname);

         // Redirect authenticated users from public/landing routes to the app
         if (auth) {
            if (pathname === "/" || pathname.startsWith("/auth/")) {
               return NextResponse.redirect(new URL("/templates", request.url));
            }
            if (pathname === "/preview/marketplace") {
               return NextResponse.redirect(
                  new URL("/marketplace", request.url)
               );
            }
         }

         // Check if user is not authenticated and accessing a protected path
         if (!auth && protectedPaths.some((p) => p.test(pathname))) {
            return false;
         }

         // Check for session cart cookie
         if (!request.cookies.get("sessionCartId")) {
            // Generate new session cart id cookie
            const sessionCartId = crypto.randomUUID();

            // Create new response, forwarding x-pathname and other headers
            const response = NextResponse.next({
               request: { headers: requestHeaders },
            });

            // Set newly generated sessionCartId in the response cookies
            response.cookies.set("sessionCartId", sessionCartId);

            return response;
         }

         // Forward x-pathname to all downstream Server Components
         return NextResponse.next({
            request: { headers: requestHeaders },
         });
      },
      async session({ session, user, trigger, token }) {
         // Set the user ID from the token
         session.user.id = token.sub;
         session.user.role = token.role;
         session.user.name = token.name;
         session.user.tier = token.tier;

         // If there is an update, set the user name
         if (trigger === "update") {
            session.user.name = user.name;
         }

         return session;
      },
      async jwt({ token, user, trigger, session }) {
         // Assign user fields to token
         if (user) {
            token.id = user.id;
            token.role = user.role;

            const userId = user.id as string;

            const subscriptionService = getSubscriptionService();
            const tier = await subscriptionService.getUserTier(userId);
            token.tier = tier;

            // If user has no name then use the email
            if (user.name === "NO_NAME") {
               token.name = user.email!.split("@")[0];

               // Update database to reflect the token name
               const data: DUserUpdate = {
                  name: token.name,
               };

               const userService = getUserService();
               await userService.updateUser(userId, data);
            }

            if (trigger === "signIn" || trigger === "signUp") {
               const cookiesObject = await cookies();
               const sessionCartId = cookiesObject.get("sessionCartId")?.value;

               if (sessionCartId) {
                  const userId = user.id as string;
                  await migrateSessionCartToUser(sessionCartId, userId);
               }
            }
         }

         // Handle session updates
         if (session?.user.name && trigger === "update") {
            token.name = session.user.name;
         }

         return token;
      },
   },
};

const getUserService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getUserService();
};

const getSubscriptionService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSubscriptionService();
};
