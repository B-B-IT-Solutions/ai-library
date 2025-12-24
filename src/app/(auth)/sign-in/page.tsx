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
   title: "Sign In",
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
         className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5"
         data-testid="sign-in-page"
      >
         <div className="w-full max-w-md">
            <Card className="border-2 shadow-xl">
               <CardHeader className="space-y-6 pb-6" data-testid="card-header">
                  <Link
                     href="/"
                     className="flex-center transition-transform hover:scale-105"
                  >
                     <Image
                        src="/images/logo.svg"
                        width={80}
                        height={80}
                        alt={`${APP_NAME} logo`}
                        priority={true}
                        className="drop-shadow-lg"
                     />
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
               <CardContent className="pb-8 px-6">
                  <CredentialsSignInForm />
               </CardContent>
            </Card>
            <p className="text-center text-xs text-muted-foreground mt-6">
               By signing in, you agree to our{" "}
               <Link
                  href="/terms"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
               >
                  Terms of Service
               </Link>{" "}
               and{" "}
               <Link
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
               >
                  Privacy Policy
               </Link>
            </p>
         </div>
      </div>
   );
};

export default SignInPage;
