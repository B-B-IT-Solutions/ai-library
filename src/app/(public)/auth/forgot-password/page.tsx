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
import { ForgotPasswordForm } from "@/components/shared/auth";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
   title: "Passwort vergessen",
};

const ForgotPasswordPage = async () => {
   const session = await auth();

   if (session) {
      return redirect("/");
   }

   return (
      <div
         className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4"
         data-testid="forgot-password-page"
      >
         <div className="w-full max-w-md">
            <Card className="border-2 shadow-xl">
               <CardHeader className="space-y-6 pb-6">
                  <Link href="/" className="flex flex-col items-center gap-3">
                     <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                  </Link>
                  <div className="space-y-2">
                     <CardTitle className="text-center text-3xl font-bold tracking-tight">
                        Passwort vergessen
                     </CardTitle>
                     <CardDescription className="text-center text-base">
                        Gib deine E-Mail-Adresse ein und wir senden dir einen
                        Link zum Zurücksetzen deines Passworts.
                     </CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="px-6 pb-8">
                  <ForgotPasswordForm />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default ForgotPasswordPage;
