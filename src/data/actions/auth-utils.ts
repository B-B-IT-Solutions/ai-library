import { auth } from "@/auth";

export async function requireUserId(): Promise<string> {
   const session = await auth();
   if (!session?.user?.id) {
      throw new Error("Authentication required");
   }
   return session.user.id;
}
