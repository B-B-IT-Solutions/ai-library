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

export const metadata: Metadata = {
   title: "Anmelden",
};

export type SignInPageSearchParams = {
   callbackUrl?: string;
};

export type SignInPageProps = {
   searchParams: Promise<SignInPageSearchParams>;
};

const SignInPage = async (props: SignInPageProps) => {
   const { callbackUrl } = await props.searchParams;

   const session = await auth();

   if (session) {
      return redirect(callbackUrl || "/");
   }

   return (
      <div
         className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4"
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
                        Welcome Back
                     </CardTitle>
                     <CardDescription
                        className="text-center text-base"
                        data-testid="card-description"
                     >
                        Sign in to continue to your account
                     </CardDescription>
                  </div>
               </CardHeader>
               <CardContent className="px-6 pb-8">
                  <CredentialsSignInForm />
               </CardContent>
            </Card>
            <p className="mt-6 text-center text-xs text-muted-foreground">
               By signing in, you agree to our{" "}
               <Link
                  href="/terms"
                  className="underline underline-offset-2 transition-colors hover:text-foreground"
               >
                  Terms of Service
               </Link>{" "}
               and{" "}
               <Link
                  href="/privacy"
                  className="underline underline-offset-2 transition-colors hover:text-foreground"
               >
                  Privacy Policy
               </Link>
            </p>
         </div>
      </div>
   );
};

export default SignInPage;
