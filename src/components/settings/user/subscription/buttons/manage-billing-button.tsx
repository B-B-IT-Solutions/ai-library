"use client";

import { useTransition } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { createCustomerPortal } from "@/data/actions/stripe";
import { navigateToExternalUrl } from "@/lib/utils";

export const ManageBillingButton = () => {
   const [isPending, startTransition] = useTransition();

   const handleManageBilling = () => {
      startTransition(async () => {
         const result = await createCustomerPortal();
         if (result.success && result.data) {
            navigateToExternalUrl(result.data.url);
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

      return (
         <>
            <ExternalLink className="mr-2 h-4 w-4" />
            Abonnement Verwalten
         </>
      );
   };

   return (
      <Button
         variant="outline"
         onClick={handleManageBilling}
         disabled={isPending}
         className="cursor-pointer"
         data-testid="manage-billing-btn"
      >
         {btnIcon()}
      </Button>
   );
};
