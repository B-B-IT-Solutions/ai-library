"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { createSubscriptionCheckout } from "@/data/actions/subscription";
import {
   DBillingInterval,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";

type PricingPlanProps = {
   plan: DSubscriptionPlan;
   isCurrent: boolean;
   isPopular: boolean;
   isFree: boolean;
};

export const PricingPlan = ({
   plan,
   isCurrent,
   isPopular,
   isFree,
}: PricingPlanProps) => {
   const router = useRouter();
   const [billingInterval, setBillingInterval] =
      useState<DBillingInterval>("YEARLY");
   const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

   const handleSubscribe = async (planId: string) => {
      setLoadingPlanId(planId);

      try {
         const result = await createSubscriptionCheckout({
            planId,
            billingInterval,
         });

         if (result.success) {
            router.push(result.data.url);
         } else {
            toast.error(result.message);
            setLoadingPlanId(null);
         }
      } catch {
         toast.error("Failed to start checkout");
         setLoadingPlanId(null);
      }
   };
   return (
      <Card
         key={plan.id}
         className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}
      >
         {isPopular && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
               Most Popular
            </Badge>
         )}

         <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
         </CardHeader>

         <CardContent>
            <div className="mb-6">
               <span className="text-4xl font-bold">
                  CHF {price.toFixed(2)}
               </span>
               {!isFree && (
                  <span className="text-muted-foreground">
                     /{billingInterval === "MONTHLY" ? "month" : "year"}
                  </span>
               )}
            </div>

            <ul className="space-y-3">
               {plan.features.maxPrompts === -1 ? (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>Unlimited prompts</span>
                  </li>
               ) : (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>Up to {plan.features.maxPrompts} prompts</span>
                  </li>
               )}

               {plan.features.maxLibraryItems === -1 ? (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>Unlimited library items</span>
                  </li>
               ) : (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>
                        Up to {plan.features.maxLibraryItems} library items
                     </span>
                  </li>
               )}

               {plan.features.canAccessMarketplace && (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>Access to marketplace</span>
                  </li>
               )}

               {plan.features.canPurchaseItems && (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>Purchase premium items</span>
                  </li>
               )}

               {plan.features.canExportPrompts && (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>Export prompts</span>
                  </li>
               )}

               {plan.features.canUseAdvancedFeatures && (
                  <li className="flex items-start">
                     <Check className="mt-0.5 mr-2 h-5 w-5 text-primary" />
                     <span>Advanced features</span>
                  </li>
               )}
            </ul>
         </CardContent>

         <CardFooter>
            {isFree ? (
               <Button
                  variant={isCurrent ? "outline" : "default"}
                  className="w-full"
                  disabled
               >
                  {isCurrent ? "Current Plan" : "Free Forever"}
               </Button>
            ) : isCurrent ? (
               <Button variant="outline" className="w-full" disabled>
                  Current Plan
               </Button>
            ) : (
               <Button
                  variant={isPopular ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loadingPlanId !== null}
               >
                  {loadingPlanId === plan.id ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                     </>
                  ) : (
                     "Subscribe"
                  )}
               </Button>
            )}
         </CardFooter>
      </Card>
   );
};
