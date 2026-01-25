"use client";

import { FC, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { createSubscriptionCheckout } from "@/data/actions/subscription";
import { DBillingInterval } from "@/data/types/domain/subscription";

type ActivateSubscriptionButtonProps = {
   planId: string;
   billingInterval: DBillingInterval;
   isPopular: boolean;
};

export const ActivateSubscriptionButton: FC<
   ActivateSubscriptionButtonProps
> = ({ planId, billingInterval, isPopular }) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleSubscribe = () => {
      startTransition(async () => {
         const result = await createSubscriptionCheckout({
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
               Loading...
            </>
         );
      }
      return "Subscribe";
   };

   return (
      <Button
         variant={isPopular ? "default" : "outline"}
         onClick={handleSubscribe}
         disabled={isPending}
         className="w-full"
         data-testid="activate-subscription-btn"
      >
         {btnIcon()}
      </Button>
   );
};
