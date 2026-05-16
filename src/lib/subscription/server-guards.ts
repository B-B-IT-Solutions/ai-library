import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";

import { canAccessFeature, FeatureName, getFeatureLimit, hasReachedLimit } from "./access-control";

export class SubscriptionAccessError extends Error {
   constructor(
      message: string,
      public feature: FeatureName
   ) {
      super(message);
      this.name = "SubscriptionAccessError";
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

/**
 * Checks whether the user has reached a count-based tier limit (e.g. maxPrompts).
 * Throws `SubscriptionAccessError` when the limit is reached so callers can
 * return an `{ upgradeRequired: true }` result to the client.
 */
export const requireCountLimit = async (
   feature: FeatureName,
   currentCount: number
): Promise<void> => {
   const user = await requireUser();
   const subscriptionService = getSubscriptionService();
   const tier = await subscriptionService.getUserTier(user.id);

   if (hasReachedLimit(tier, feature, currentCount)) {
      const limit = getFeatureLimit(tier, feature);
      throw new SubscriptionAccessError(
         `Limit erreicht: Dein Plan (${tier}) erlaubt maximal ${limit} Einträge für "${feature}". Bitte upgrade dein Abo.`,
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
