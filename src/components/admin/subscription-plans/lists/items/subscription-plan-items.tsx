"use client";

import { map } from "es-toolkit/compat";

import { DSubscriptionPlan } from "@/data/types/domain/subscription";
import { SubscriptionPlan } from "../item/subcription-plan";

type Props = {
   plans: DSubscriptionPlan[];
};

export const SubscriptionPlanItems = ({ plans }: Props) => {
   return (
      <div
         className="grid grid-cols-1 gap-6 lg:grid-cols-3"
         data-testid="subscription-plan-items"
      >
         {map(plans, (plan) => (
            <SubscriptionPlan key={plan.id} plan={plan} />
         ))}
      </div>
   );
};
