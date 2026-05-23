"use client";

import { FC, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { reactivateSubscription } from "@/data/actions/stripe";

export const ReactivateSubscriptionButton: FC = () => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleReactivate = () => {
      startTransition(async () => {
         const result = await reactivateSubscription();
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
         router.refresh();
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
      return "Reaktivieren";
   };

   return (
      <Button
         onClick={handleReactivate}
         disabled={isPending}
         variant="default"
         data-testid="reactivate-subscription-btn"
      >
         {btnIcon()}
      </Button>
   );
};
