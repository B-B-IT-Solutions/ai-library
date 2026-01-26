"use server";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DSubscription,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";

export const getSubscriptionPlans = async (): Promise<DSubscriptionPlan[]> => {
   await requireUser();
   const subscriptionService = getSubscriptionService();
   return await subscriptionService.getAvailablePlans();
};

export const getUserSubscription = async (): Promise<DSubscription | null> => {
   const user = await requireUser();
   const subscriptionService = getSubscriptionService();
   return await subscriptionService.getUserSubscription(user.id);
};

// export const getUserTier = async (): Promise<DSubscriptionTier> => {
//    const user = await requireUser();
//    const subscriptionService = getSubscriptionService();
//    return await subscriptionService.getUserTier(user.id);
// };

// export const hasActiveSubscription = async (): Promise<
//    ActionResult<boolean>
// > => {
//    try {
//       const user = await requireUser();
//       const subscriptionService = getSubscriptionService();
//       const hasAccess = await subscriptionService.hasActiveAccess(user.id);
//       return {
//          success: true,
//          message: "",
//          data: hasAccess,
//       };
//    } catch (error) {
//       return { success: false, message: formatError(error) };
//    }
// };

// export const reactivateSubscription = async (): Promise<ActionResult<void>> => {
//    try {
//       const user = await requireUser();
//       const subscriptionService = getSubscriptionService();
//       await subscriptionService.reactivateSubscription(user.id);
//       return {
//          success: true,
//          message: "Subscription reactivated successfully",
//       };
//    } catch {
//       return {
//          success: false,
//          message: "Subscription couldn't be reactivated",
//       };
//    }
// };

export const createCustomerPortal = async (): Promise<
   ActionResult<{ url: string }>
> => {
   try {
      const user = await requireUser();
      const subscriptionService = getSubscriptionService();
      const data = await subscriptionService.createPortalSession(user.id);
      return {
         success: true,
         message: "",
         data,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

const getSubscriptionService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSubscriptionService();
};
