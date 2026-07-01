import type { DefaultSession } from "next-auth";

import type { DSubscriptionTier } from "@/data/types/domain/subscription";
import { DUserRole } from "@/data/types/domain/user";

declare module "next-auth/jwt" {
   interface JWT {
      sub: string;
      role: DUserRole;
      name: string;
      tier: DSubscriptionTier;
   }
}

declare module "next-auth" {
   interface Session {
      user: {
         role: DUserRole;
         tier: DSubscriptionTier;
      } & DefaultSession["user"];
   }

   interface User {
      role: DUserRole;
   }
}

declare module "@auth/core/adapters" {
   interface AdapterUser {
      role: DUserRole;
   }
}

type LoginUser = {
   id: string;
   name?: string | null;
   email?: string | null;
};
