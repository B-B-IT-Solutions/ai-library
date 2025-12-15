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
import { SignUpForm } from "@/components/shared/auth";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
   title: "Sign Up",
};

export type SignUpPageProps = {
   searchParams: Promise<{
      callbackUrl?: string;
   }>;
};

const SignUpPage = async (props: SignUpPageProps) => {
   const { callbackUrl } = await props.searchParams;

   const session = await auth();

   if (session) {
      return redirect(callbackUrl || "/");
   }

   return (
      <div className="w-full max-w-md mx-auto" data-testid="sign-up-page">
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
                  Create Account
               </CardTitle>
               <CardDescription
                  className="text-center"
                  data-testid="card-description"
               >
                  Enter your information below to sign up
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <SignUpForm />
            </CardContent>
         </Card>
      </div>
   );
};

export default SignUpPage;
