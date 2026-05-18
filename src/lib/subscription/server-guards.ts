import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";

import { canAccessFeature, FeatureName } from "./access-control";

export class SubscriptionAccessError extends Error {
   constructor(
      message: string,
      public readonly feature: FeatureName
   ) {
      super(message);
      this.name = "SubscriptionAccessError";
      Object.setPrototypeOf(this, SubscriptionAccessError.prototype);
   }
}

export const requireSubscriptionAccess = async (
   feature: FeatureName
): Promise<void> => {
   const user = await requireUser();

   const subscriptionService = getSubscriptionService();

   const tier = await subscriptionService.getUserTier(user.id);

   if (!canAccessFeature(tier, feature)) {
      throw new SubscriptionAccessError(
         `Your current plan (${tier}) does not have access to this feature. Please upgrade to continue.`,
         feature
      );
   }
};

export const checkFeatureAccess = async (
   feature: FeatureName
): Promise<boolean> => {
   try {
      await requireSubscriptionAccess(feature);
      return true;
   } catch (error) {
      if (error instanceof SubscriptionAccessError) {
         return false;
      }
      throw error;
   }
};

const getSubscriptionService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSubscriptionService();
};
