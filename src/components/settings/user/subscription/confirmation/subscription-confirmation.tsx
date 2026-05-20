import { CheckCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";

export const SubscriptionConfirmation = () => {
   return (
      <Card className="w-full max-w-md" data-testid="subscription-confirmation">
         <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
               <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
            <CardDescription>
               Your subscription has been successfully activated. You now have
               access to all premium features.
            </CardDescription>
         </CardHeader>

         <CardContent className="space-y-4">
            <div className="space-y-2">
               <Button asChild={true} className="w-full" size="lg">
                  <Link href="/prompts" data-testid="prompts-link">
                     Start Creating
                  </Link>
               </Button>

               <Button
                  asChild={true}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  data-testid="view-subscription-link"
               >
                  <Link href="/settings/subscription">View Subscription </Link>
               </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
               You can manage your subscription anytime from your settings page.
            </div>
         </CardContent>
      </Card>
   );
};
