import { FC } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { DSubscription } from "@/data/types/domain/subscription";
import { formatDateTime } from "@/lib/utils";

import {
   CancelSubscriptionButton,
   ManageBillingButton,
   ReactivateSubscriptionButton,
   ViewPlansLink,
} from "./buttons";

type SubscriptionStatusProps = {
   subscription: DSubscription | null;
};

export const SubscriptionStatus: FC<SubscriptionStatusProps> = ({
   subscription,
}) => {
   if (!subscription) {
      return (
         <Card data-testid="subscription-free-plan">
            <CardHeader>
               <CardTitle>Subscription</CardTitle>
               <CardDescription>
                  You are currently on the Free plan
               </CardDescription>
            </CardHeader>
            <CardContent>
               <ViewPlansLink />
            </CardContent>
         </Card>
      );
   }

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

   const currentPeriodEnd = () => {
      if (subscription.currentPeriodEnd) {
         const text = subscription.cancelAtPeriodEnd
            ? "Expires On"
            : "Next Billing Date";
         return (
            <div data-testid="current-period-end">
               <div className="mb-1 text-sm font-medium text-muted-foreground">
                  {text}
               </div>
               <div>{formatDate(subscription.currentPeriodEnd)}</div>
            </div>
         );
      }
   };

   const cancelAtPeriodEnd = () => {
      if (subscription.cancelAtPeriodEnd) {
         return (
            <div
               className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950"
               data-testid="cancel-at-period-end"
            >
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
         );
      }
   };

   const actionBtns = () => {
      return (
         <div className="flex gap-2 pt-4">
            <ManageBillingButton />
            {subscription.cancelAtPeriodEnd ? (
               <ReactivateSubscriptionButton />
            ) : (
               <CancelSubscriptionButton subscription={subscription} />
            )}
         </div>
      );
   };

   return (
      <Card data-testid="subscription-paid-plan">
         <CardHeader>
            <div className="flex items-center justify-between">
               <div className="space-y-2">
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

            {currentPeriodEnd()}
            {cancelAtPeriodEnd()}

            {actionBtns()}
         </CardContent>
      </Card>
   );
};
