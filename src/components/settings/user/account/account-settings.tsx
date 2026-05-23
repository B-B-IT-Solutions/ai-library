import { getSubscription } from "@/data/actions/subscription";

import { DeleteAcount } from "./delete-account";

export const AccountSettings = async () => {
   const subscription = await getSubscription();

   return (
      <div data-testid="account-settings">
         <DeleteAcount subscription={subscription} />
      </div>
   );
};
