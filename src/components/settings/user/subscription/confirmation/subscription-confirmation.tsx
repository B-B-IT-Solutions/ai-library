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
      <Card
         className="w-full max-w-lg overflow-hidden pb-0"
         data-testid="subscription-confirmation"
      >
         <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

         <CardHeader className="pt-8 pb-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-md ring-8 ring-green-50 dark:bg-green-900 dark:ring-green-950">
               <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <CardTitle className="text-3xl font-bold tracking-tight">
               Abo aktiviert!
            </CardTitle>
            <CardDescription className="mt-2 text-base leading-relaxed">
               Dein Abonnement wurde erfolgreich aktiviert. Du hast jetzt Zugang
               zu allen Funktionen deines Tarifs.
            </CardDescription>
         </CardHeader>

         <CardContent className="pb-8">
            <div className="flex flex-col items-center gap-4">
               <Button asChild={true} size="lg">
                  <Link href="/templates" data-testid="templates-link">
                     Zu meinen Prompts
                  </Link>
               </Button>

               <Link
                  href="/settings/subscription"
                  className="text-sm text-foreground underline-offset-4 hover:underline"
                  data-testid="view-subscription-link"
               >
                  Abo verwalten
               </Link>
            </div>
         </CardContent>

         <div className="border-t bg-muted/40 px-6 pt-3 pb-2">
            <p className="text-center text-xs text-muted-foreground/70">
               Du kannst dein Abonnement jederzeit in den Einstellungen anpassen
               oder kündigen.
            </p>
         </div>
      </Card>
   );
};
