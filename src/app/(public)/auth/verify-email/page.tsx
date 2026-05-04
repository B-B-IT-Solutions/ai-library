import { Metadata } from "next";
import Link from "next/link";

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { VerifyEmailForm } from "@/components/shared/auth/verify-email-form";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
   title: "E-Mail bestätigen",
};

export type PageSearchParams = {
   email?: string;
};

export type PageProps = {
   searchParams: Promise<PageSearchParams>;
};

export const VerifyEmailPage = async ({ searchParams }: PageProps) => {
   const { email } = await searchParams;

   return (
      <div
         className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4"
         data-testid="verify-email-page"
      >
         <div className="w-full max-w-md">
            <Card className="border-2 shadow-xl">
               <CardHeader className="space-y-6 pb-6">
                  <Link href="/" className="flex flex-col items-center gap-3">
                     <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                  </Link>
                  <div className="space-y-2">
                     <CardTitle
                        className="text-center text-3xl font-bold tracking-tight"
                        data-testid="title"
                     >
                        E-Mail bestätigen
                     </CardTitle>
                     <CardDescription
                        className="text-center text-base"
                        data-testid="description"
                     >
                        Wir haben dir eine E-Mail mit einem Bestätigungslink
                        geschickt
                     </CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="px-6 pb-8">
                  <VerifyEmailForm email={email} />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default VerifyEmailPage;
