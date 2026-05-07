import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { ResetPasswordForm } from "@/components/shared/auth";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
   title: "Passwort zurücksetzen",
};

export type PageSearchParams = {
   token?: string;
   email?: string;
};

export type PageProps = {
   searchParams: Promise<PageSearchParams>;
};

export const ResetPasswordPage = async ({ searchParams }: PageProps) => {
   const session = await auth();

   if (session) {
      return redirect("/");
   }

   const { token, email } = await searchParams;

   if (!token || !email) {
      return redirect("/auth/sign-in?error=invalid_link");
   }

   return (
      <div
         className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4"
         data-testid="reset-password-page"
      >
         <div className="w-full max-w-md">
            <Card className="border-2 shadow-xl">
               <CardHeader className="space-y-6 pb-6">
                  <Link href="/" className="flex flex-col items-center gap-3">
                     <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                  </Link>
                  <div className="space-y-2">
                     <CardTitle className="text-center text-3xl font-bold tracking-tight">
                        Neues Passwort setzen
                     </CardTitle>
                     <CardDescription className="text-center text-base">
                        Gib dein neues Passwort ein.
                     </CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="px-6 pb-8">
                  <ResetPasswordForm email={email} token={token} />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default ResetPasswordPage;
