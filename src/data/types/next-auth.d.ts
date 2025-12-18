import type { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
   interface JWT {
      sub: string;
      role: string;
      name: string;
   }
}

declare module "next-auth" {
   interface Session {
      user: {
         role: string;
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
