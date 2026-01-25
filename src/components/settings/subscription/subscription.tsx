import { getUserSubscription } from "@/data/actions/subscription";

import { ActivePlan } from "./active-plan";

export const Subscription = async () => {
   const subscription = await getUserSubscription();

   return (
      <div data-testid="subscription">
         <ActivePlan subscription={subscription} />
      </div>
   );
};
