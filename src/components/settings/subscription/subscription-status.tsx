"use client";

import { FC, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
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
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import {
   cancelSubscription,
   reactivateSubscription,
} from "@/data/actions/subscription";
import { DSubscription } from "@/data/types/domain/subscription";
import { formatDateTime } from "@/lib/utils";

import { ManageBillingButton, ReactivateSubscriptionButton } from "./buttons";

type SubscriptionStatusProps = {
   subscription: DSubscription | null;
};

export const SubscriptionStatus: FC<SubscriptionStatusProps> = ({
   subscription,
}) => {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const [actionType, setActionType] = useState<
      "cancel" | "reactivate" | "portal" | null
   >(null);

   if (!subscription) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Subscription</CardTitle>
               <CardDescription>
                  You are currently on the Free plan
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Button asChild={true}>
                  <Link href="/subscription/pricing"> View Plans</Link>
               </Button>
            </CardContent>
         </Card>
      );
   }

   const handleCancel = async () => {
      setIsLoading(true);
      setActionType("cancel");

      try {
         const result = await cancelSubscription();

         if (result.success) {
            toast.success(
               "Subscription will be canceled at the end of the period"
            );
            router.refresh();
         } else {
            toast.error(result.message);
         }
      } catch {
         toast.error("Failed to cancel subscription");
      } finally {
         setIsLoading(false);
         setActionType(null);
      }
   };

   const handleReactivate = async () => {
      setIsLoading(true);
      setActionType("reactivate");

      try {
         const result = await reactivateSubscription();

         if (result.success) {
            toast.success("Subscription reactivated successfully");
            router.refresh();
         } else {
            toast.error(result.message);
         }
      } catch {
         toast.error("Failed to reactivate subscription");
      } finally {
         setIsLoading(false);
         setActionType(null);
      }
   };

   const formatDate = (dateString: string | null) => {
      if (!dateString) {
         return "N/A";
      }
      return formatDateTime(dateString).dateTime;
   };

   const statusBadge = () => {
      switch (subscription.status) {
         case "ACTIVE":
            return (
               <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
               </Badge>
            );
         case "CANCELED":
            return (
               <Badge variant="secondary">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Canceled
               </Badge>
            );
         case "PAST_DUE":
            return (
               <Badge variant="destructive">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Past Due
               </Badge>
            );
         default:
            return <Badge variant="outline">{subscription.status}</Badge>;
      }
   };

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>
                     Manage your subscription plan
                  </CardDescription>
               </div>
               {statusBadge()}
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            <div>
               <div className="mb-1 text-sm font-medium text-muted-foreground">
                  Current Plan
               </div>
               <div className="text-lg font-semibold">
                  {subscription.plan.name}
               </div>
            </div>

            <div>
               <div className="mb-1 text-sm font-medium text-muted-foreground">
                  Billing Interval
               </div>
               <div className="capitalize">
                  {subscription.billingInterval.toLowerCase()}
               </div>
            </div>

            {subscription.currentPeriodEnd && (
               <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">
                     {subscription.cancelAtPeriodEnd
                        ? "Expires On"
                        : "Next Billing Date"}
                  </div>
                  <div>{formatDate(subscription.currentPeriodEnd)}</div>
               </div>
            )}

            {subscription.cancelAtPeriodEnd && (
               <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <div className="flex items-start">
                     <AlertCircle className="mt-0.5 mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                     <div>
                        <div className="font-medium text-amber-900 dark:text-amber-100">
                           Subscription Ending
                        </div>
                        <div className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                           Your subscription will end on{" "}
                           {formatDate(subscription.currentPeriodEnd)}. You'll
                           still have access until then.
                        </div>
                     </div>
                  </div>
               </div>
            )}

            <div className="flex gap-2 pt-4">
               <ManageBillingButton />
               <ReactivateSubscriptionButton />

               {subscription.cancelAtPeriodEnd ? (
                  <ReactivateSubscriptionButton />
               ) : (
                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isLoading}>
                           Cancel Subscription
                        </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                           <AlertDialogDescription>
                              Your subscription will be canceled at the end of
                              the current billing period. You'll continue to
                              have access until{" "}
                              {formatDate(subscription.currentPeriodEnd)}.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>
                              Keep Subscription
                           </AlertDialogCancel>
                           <AlertDialogAction onClick={handleCancel}>
                              {isLoading && actionType === "cancel" ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Canceling...
                                 </>
                              ) : (
                                 "Cancel Subscription"
                              )}
                           </AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               )}
            </div>
         </CardContent>
      </Card>
   );
};
