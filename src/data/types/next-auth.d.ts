import type { DefaultSession } from "next-auth";
import type { DSubscriptionTier } from "./domain/subscription";

declare module "next-auth/jwt" {
   interface JWT {
      sub: string;
      role: string;
      name: string;
      subscriptionTier: DSubscriptionTier;
   }
}

declare module "next-auth" {
   interface Session {
      user: {
         role: string;
         subscriptionTier: DSubscriptionTier;
      } & DefaultSession["user"];
   }

   interface User {
      role: string;
   }
}

declare module "@auth/core/adapters" {
   interface AdapterUser {
      role: string;
   }
}

type LoginUser = {
   id: string;
   email?: string | null;
};
