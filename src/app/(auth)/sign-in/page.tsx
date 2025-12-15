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

export type SignInPageProps = {
   searchParams: Promise<{
      callbackUrl?: string;
   }>;
};

const SignInPage = async (props: SignInPageProps) => {
   const { callbackUrl } = await props.searchParams;

   const session = await auth();

   if (session) {
      return redirect(callbackUrl || "/");
   }

   return (
      <div className="w-full max-w-md mx-auto" data-testid="sign-in-page">
         <Card>
            <CardHeader className="space-y-4" data-testid="card-header">
               <Link href="/" className="flex-center">
                  <Image
                     src="/images/logo.svg"
                     width={100}
                     height={100}
                     alt={`${APP_NAME} logo`}
                     priority={true}
                  />
               </Link>
               <CardTitle className="text-center" data-testid="card-title">
                  Sign In
               </CardTitle>
               <CardDescription
                  className="text-center"
                  data-testid="card-description"
               >
                  Sign in to your account
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <CredentialsSignInForm />
            </CardContent>
         </Card>
      </div>
   );
};

export default SignInPage;
