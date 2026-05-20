import { Metadata } from "next";

import { SubscriptionConfirmation } from "@/components/settings/user/subscription";

export const metadata: Metadata = {
   title: "Subscription Success",
};

export const SubscriptionSuccessPage = async () => {
   return (
      <div
         className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16"
         data-testid="subscription-success-page"
      >
         <SubscriptionConfirmation />
      </div>
   );
};

export default SubscriptionSuccessPage;
