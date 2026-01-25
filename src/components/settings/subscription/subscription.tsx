import { getUserSubscription } from "@/data/actions/subscription";

import { SubscriptionStatus } from "./subscription-status";

export const Subscription = async () => {
   const subscription = await getUserSubscription();

   return (
      <div data-testid="subscription">
         <SubscriptionStatus subscription={subscription} />
      </div>
   );
};
