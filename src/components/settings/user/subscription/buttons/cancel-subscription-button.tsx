"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import { cancelSubscription } from "@/data/actions/stripe";
import { DSubscription } from "@/data/types/domain/subscription";
import { formatDateTime } from "@/lib/utils";

type Props = {
   subscription: DSubscription;
};

export const CancelSubscriptionButton = ({ subscription }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleCancel = () => {
      startTransition(async () => {
         const result = await cancelSubscription();
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const formatDate = (dateString: string | null) => {
      if (!dateString) {
         return "N/A";
      }
      return formatDateTime(dateString).dateTime;
   };

   const btnIcon = () => {
      if (isPending) {
         return (
            <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Wird kündigt...
            </>
         );
      }
      return "Cancel Subscription";
   };

   return (
      <AlertDialog data-testid="dialog">
         <AlertDialogTrigger asChild>
            <Button
               variant="destructive"
               disabled={isPending}
               className="cursor-pointer"
               data-testid="cancel-subscription-btn"
            >
               Abonnement Kündigen
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent data-testid="dialog-content">
            <AlertDialogHeader>
               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
               <AlertDialogDescription>
                  Your subscription will be canceled at the end of the current
                  billing period. You'll continue to have access until{" "}
                  {formatDate(subscription.currentPeriodEnd)}.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel data-testid="cancel-btn">
                  Keep Subscription
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleCancel}
                  data-testid="confirm-btn"
               >
                  {btnIcon()}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
