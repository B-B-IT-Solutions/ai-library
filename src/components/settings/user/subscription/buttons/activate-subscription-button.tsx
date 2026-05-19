"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { createSubscriptionCheckoutSession } from "@/data/actions/stripe";
import { DBillingInterval } from "@/data/types/domain/subscription";

type Props = {
   planId: string;
   billingInterval: DBillingInterval;
   isPopular: boolean;
};

export const ActivateSubscriptionButton = ({
   planId,
   billingInterval,
   isPopular,
}: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleSubscribe = () => {
      startTransition(async () => {
         const result = await createSubscriptionCheckoutSession({
            planId,
            billingInterval,
         });

         if (result.success && result.data) {
            router.push(result.data.url);
         } else {
            toast.error(result.message);
         }
      });
   };

   const btnIcon = () => {
      if (isPending) {
         return (
            <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Lädt...
            </>
         );
      }
      return "Abonnieren";
   };

   return (
      <Button
         variant={isPopular ? "default" : "outline"}
         onClick={handleSubscribe}
         disabled={isPending}
         className="w-full cursor-pointer"
         data-testid="activate-subscription-btn"
      >
         {btnIcon()}
      </Button>
   );
};
