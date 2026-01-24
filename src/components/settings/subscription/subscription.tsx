import { getUserSubscription } from "@/data/actions/subscription";

import { SubscriptionStatus } from "./subscription-status";

export const Subscription = async () => {
   const subscriptionResult = await getUserSubscription();
   const subscription = subscriptionResult.success
      ? subscriptionResult.data
      : null;

   return (
      <div data-testid="subscription">
         <SubscriptionStatus subscription={subscription} />
      </div>
   );
};
