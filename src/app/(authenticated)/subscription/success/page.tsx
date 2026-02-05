import { CheckCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";

export const metadata: Metadata = {
   title: "Subscription Success",
};

const SubscriptionSuccessPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   return (
      <div
         className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16"
         data-testid="subscription-success-page"
      >
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
               </div>
               <CardTitle className="text-2xl">
                  Subscription Activated!
               </CardTitle>
               <CardDescription>
                  Your subscription has been successfully activated. You now
                  have access to all premium features.
               </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Link href="/prompts" data-testid="prompts-link">
                     <Button className="w-full" size="lg">
                        Start Creating
                     </Button>
                  </Link>

                  <Link href="/settings/subscription">
                     <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        data-testid="subscription-link"
                     >
                        View Subscription
                     </Button>
                  </Link>
               </div>

               <div className="text-center text-sm text-muted-foreground">
                  You can manage your subscription anytime from your settings
                  page.
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default SubscriptionSuccessPage;
