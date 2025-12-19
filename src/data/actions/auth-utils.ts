import { auth } from "@/auth";
import { LoginUser } from "@/data/types/next-auth";

export async function requireUser(): Promise<LoginUser> {
   const session = await auth();
   if (!session?.user?.id) {
      throw new Error("Authentication required");
   }
   return {
      id: session.user.id,
      email: session.user.email,
   };
}
