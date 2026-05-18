"use client";

import { FC, useState } from "react";
import { map } from "es-toolkit/compat";

import { Badge } from "@/components/shadcn/badge";
import {
   DBillingInterval,
   DSubscription,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";

import { PricingPlan } from "./pricing-plan";

type Props = {
   plans: DSubscriptionPlan[];
   currentSubscription: DSubscription | null;
   freeAction?: React.ReactNode;
};

export const PricingPlans: FC<Props> = ({
   plans,
   currentSubscription,
   freeAction,
}) => {
   const [interval, setInterval] = useState<DBillingInterval>("YEARLY");

   const sortedPlans = [...plans].sort((a, b) => {
      const tierOrder = { FREE: 0, BASIC: 1, PRO: 2 };
      return tierOrder[a.tier] - tierOrder[b.tier];
   });

   const isCurrent = (planTier: string) => {
      return currentSubscription?.plan.tier === planTier;
   };

   const billingIntervalSwitch = () => {
      const isMonthly = interval === "MONTHLY";
      const isYearly = interval === "YEARLY";

      return (
         <div className="inline-flex rounded-lg border p-1">
            <button
               onClick={() => setInterval("MONTHLY")}
               className={`rounded-md px-4 py-2 transition-colors ${
                  isMonthly
                     ? "bg-primary text-primary-foreground"
                     : "hover:bg-muted"
               }`}
               data-active={isMonthly}
               data-testid="monthly-btn"
            >
               Monthly
            </button>
            <button
               onClick={() => setInterval("YEARLY")}
               className={`rounded-md px-4 py-2 transition-colors ${
                  isYearly
                     ? "bg-primary text-primary-foreground"
                     : "hover:bg-muted"
               }`}
               data-active={isYearly}
               data-testid="yearly-btn"
            >
               Yearly
               <Badge variant="secondary" className="ml-2">
                  Save 17%
               </Badge>
            </button>
         </div>
      );
   };

   const pricingPlans = () => {
      return map(sortedPlans, (plan) => {
         return (
            <PricingPlan
               key={plan.id}
               plan={plan}
               billingInterval={interval}
               isCurrent={isCurrent(plan.tier)}
               freeAction={freeAction}
            />
         );
      });
   };

   return (
      <div data-testid="pricing-plans">
         <div className="mb-8 flex justify-center">
            {billingIntervalSwitch()}
         </div>
         <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {pricingPlans()}
         </div>
      </div>
   );
};
