import { ArrowRight, CheckCircle, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";

export const SubscriptionConfirmation = () => {
   return (
      <Card
         className="w-full max-w-lg overflow-hidden"
         data-testid="subscription-confirmation"
      >
         <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

         <CardHeader className="pb-4 pt-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-md ring-8 ring-green-50 dark:bg-green-900 dark:ring-green-950">
               <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <CardTitle className="text-3xl font-bold tracking-tight">
               Abo aktiviert!
            </CardTitle>
            <CardDescription className="mt-2 text-base leading-relaxed">
               Dein Abonnement wurde erfolgreich aktiviert. Du hast jetzt
               Zugang zu allen Funktionen deines Tarifs.
            </CardDescription>
         </CardHeader>

         <CardContent className="pb-8">
            <div className="space-y-2.5">
               <Button asChild={true} className="w-full" size="lg">
                  <Link href="/prompts" data-testid="prompts-link">
                     <Sparkles className="h-4 w-4" />
                     Jetzt loslegen
                     <ArrowRight className="h-4 w-4" />
                  </Link>
               </Button>

               <Button
                  asChild={true}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  data-testid="view-subscription-link"
               >
                  <Link href="/settings/subscription">
                     <Settings2 className="h-4 w-4" />
                     Abo verwalten
                  </Link>
               </Button>
            </div>

            <Separator className="my-8" />

            <p className="text-center text-xs text-muted-foreground">
               Du kannst dein Abonnement jederzeit in den Einstellungen
               anpassen oder kündigen.
            </p>
         </CardContent>
      </Card>
   );
};
