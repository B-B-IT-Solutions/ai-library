import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";

import { canAccessFeature, FeatureName } from "./access-control";

export class SubscriptionAccessError extends Error {
  constructor(message: string, public feature: FeatureName) {
    super(message);
    this.name = "SubscriptionAccessError";
  }
}

export const requireSubscriptionAccess = async (
  feature: FeatureName,
  dbClient: DbClient = prisma
): Promise<void> => {
  const user = await requireUser();

  const factory = new ServiceFactory(dbClient);
  const subscriptionService = factory.getSubscriptionService();

  const tier = await subscriptionService.getUserTier(user.id);

  if (!canAccessFeature(tier, feature)) {
    throw new SubscriptionAccessError(
      `Your current plan (${tier}) does not have access to this feature. Please upgrade to continue.`,
      feature
    );
  }
};

export const checkFeatureAccess = async (
  feature: FeatureName,
  dbClient: DbClient = prisma
): Promise<boolean> => {
  try {
    await requireSubscriptionAccess(feature, dbClient);
    return true;
  } catch (error) {
    if (error instanceof SubscriptionAccessError) {
      return false;
    }
    throw error;
  }
};
