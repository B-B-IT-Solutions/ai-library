"use server";

import { auth } from "@/auth";
import {
   pCancelSubscription,
   pGetActiveUserSubscription,
} from "@/data/db/queries/purchase";
import { DSubscription } from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";
import { toDSubscription } from "../library/library.mapper";
import { formatError } from "../utils";

export const getActiveSubscription =
   async (): Promise<DSubscription | null> => {
      const session = await auth();
      if (!session?.user?.id) {
         return null;
      }

      const subscription = await pGetActiveUserSubscription(session.user.id);
      if (!subscription) {
         return null;
      }

      return toDSubscription(subscription);
   };

export const cancelSubscription = async (
   subscriptionId: string
): Promise<ActionResult<void>> => {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return {
            success: false,
            message: "You must be logged in to cancel a subscription.",
         };
      }

      // Verify subscription belongs to user
      const subscription = await pGetActiveUserSubscription(session.user.id);
      if (!subscription || subscription.id !== subscriptionId) {
         return {
            success: false,
            message: "Subscription not found.",
         };
      }

      await pCancelSubscription(subscriptionId);

      return {
         success: true,
         message: "Subscription canceled successfully.",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const checkSubscriptionAccess = async (): Promise<boolean> => {
   const session = await auth();
   if (!session?.user?.id) {
      return false;
   }

   const subscription = await pGetActiveUserSubscription(session.user.id);
   return subscription !== null;
};
