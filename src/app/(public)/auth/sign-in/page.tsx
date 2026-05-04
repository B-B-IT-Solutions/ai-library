import { Metadata } from "next";
import Image from "next/image";
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
import { CredentialsSignInForm } from "@/components/shared/auth";
import { APP_NAME } from "@/lib/constants";

export const SIGN_IN_ERROR_MESSAGES: Record<string, string> = {
   expired_link:
      "Der Bestätigungslink ist abgelaufen. Bitte fordere einen neuen an.",
   invalid_link: "Ungültiger Bestätigungslink. Bitte fordere einen neuen an.",
};

export const metadata: Metadata = {
   title: "Anmelden",
};

export type PageSearchParams = {
   callbackUrl?: string;
   verified?: string;
   error?: string;
};

export type PageProps = {
   searchParams: Promise<PageSearchParams>;
};

export const SignInPage = async ({ searchParams }: PageProps) => {
   const { callbackUrl, verified, error } = await searchParams;

   const session = await auth();

   if (session) {
      return redirect(callbackUrl || "/");
   }

   const banners = () => {
      if (verified === "true") {
         return (
            <div
               className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
               data-testid="verified-banner"
            >
               E-Mail-Adresse erfolgreich bestätigt. Du kannst dich jetzt
               anmelden.
            </div>
         );
      }
      if (error && SIGN_IN_ERROR_MESSAGES[error]) {
         return (
            <div
               className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
               data-testid="error-banner"
            >
               {SIGN_IN_ERROR_MESSAGES[error]}
            </div>
         );
      }
   };

   return (
      <div
         className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4"
         data-testid="sign-in-page"
      >
         <div className="w-full max-w-md">
            <Card className="border-2 shadow-xl">
               <CardHeader className="space-y-6 pb-6" data-testid="card-header">
                  <Link
                     href="/"
                     className="flex flex-col items-center gap-3 transition-transform hover:scale-105"
                  >
                     <Image
                        src="/images/logo.svg"
                        width={80}
                        height={80}
                        alt={`${APP_NAME} logo`}
                        priority={true}
                        className="drop-shadow-lg"
                     />
                     <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                  </Link>
                  <div className="space-y-2">
                     <CardTitle
                        className="text-center text-3xl font-bold tracking-tight"
                        data-testid="card-title"
                     >
                        Willkommen zurück
                     </CardTitle>
                     <CardDescription
                        className="text-center text-base"
                        data-testid="card-description"
                     >
                        Melde dich an, um zu deinem Konto zu gelangen
                     </CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="px-6 pb-8">
                  {banners()}
                  <CredentialsSignInForm />
               </CardContent>
            </Card>
            <p className="mt-6 text-center text-xs text-muted-foreground">
               Mit der Anmeldung stimmst du unseren{" "}
               <Link
                  href="https://www.iubenda.com/terms-and-conditions/97062585"
                  target="_blank"
                  className="underline underline-offset-2 transition-colors hover:text-foreground"
                  data-testid="terms_conditions_link"
               >
                  Nutzungsbedingungen
               </Link>{" "}
               und unserer{" "}
               <Link
                  href="https://www.iubenda.com/privacy-policy/97062585/full-legal"
                  target="_blank"
                  className="underline underline-offset-2 transition-colors hover:text-foreground"
                  data-testid="privacy_policy_link"
               >
                  Datenschutzerklärung
               </Link>{" "}
               zu
            </p>
         </div>
      </div>
   );
};

export default SignInPage;
