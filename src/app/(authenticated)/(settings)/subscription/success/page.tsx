import { Metadata } from "next";

import { SubscriptionConfirmation } from "@/components/settings/user/subscription";

export const metadata: Metadata = {
   title: "Subscription Success",
};

export const SubscriptionSuccessPage = async () => {
   return (
      <div className="h-full" data-testid="subscription-success-page">
         <SubscriptionConfirmation />
      </div>
   );
};

export default SubscriptionSuccessPage;
