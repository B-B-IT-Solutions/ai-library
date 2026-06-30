import { range } from "es-toolkit/compat";

import { UserWithSubscription } from "@/data/types/db/admin/user";

import {
   pSubscription,
   pSubscriptionPlan,
   pUser,
} from "./persistence.data.mocks";

export const pUsersWithSubscription = (count = 3): UserWithSubscription[] => {
   return range(0, count).map((i) => pUserWithSubscription(i));
};

export const pUserWithSubscription = (index = 1): UserWithSubscription => {
   const user = pUser(index);
   const subscription = {
      ...pSubscription(index),
      plan: pSubscriptionPlan(index),
   };

   return {
      ...user,
      subscription: subscription,
   };
};
