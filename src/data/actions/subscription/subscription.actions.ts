"use server";

import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
  DSubscription,
  DSubscriptionPlan,
  DSubscriptionTier,
  DBillingInterval,
} from "@/data/types/domain/subscription";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Read Operations

export const getUserSubscription = async (): Promise<
  ActionResult<DSubscription | null>
> => {
  try {
    const user = await requireUser();
    const subscriptionService = getSubscriptionService();
    const subscription = await subscriptionService.getUserSubscription(
      user.id
    );
    return { success: true, data: subscription };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

export const getSubscriptionPlans = async (): Promise<
  ActionResult<DSubscriptionPlan[]>
> => {
  try {
    const subscriptionService = getSubscriptionService();
    const plans = await subscriptionService.getAvailablePlans();
    return { success: true, data: plans };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

export const getUserTier = async (): Promise<
  ActionResult<DSubscriptionTier>
> => {
  try {
    const user = await requireUser();
    const subscriptionService = getSubscriptionService();
    const tier = await subscriptionService.getUserTier(user.id);
    return { success: true, data: tier };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

export const hasActiveSubscription = async (): Promise<
  ActionResult<boolean>
> => {
  try {
    const user = await requireUser();
    const subscriptionService = getSubscriptionService();
    const hasAccess = await subscriptionService.hasActiveAccess(user.id);
    return { success: true, data: hasAccess };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

// Subscription Management

export const createSubscriptionCheckout = async (params: {
  planId: string;
  billingInterval: DBillingInterval;
}): Promise<ActionResult<{ sessionId: string; url: string }>> => {
  try {
    const user = await requireUser();
    const subscriptionService = getSubscriptionService();

    const result = await subscriptionService.createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      planId: params.planId,
      billingInterval: params.billingInterval,
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

export const createCustomerPortal = async (): Promise<
  ActionResult<{ url: string }>
> => {
  try {
    const user = await requireUser();
    const subscriptionService = getSubscriptionService();
    const result = await subscriptionService.createPortalSession(user.id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

export const cancelSubscription = async (): Promise<ActionResult<void>> => {
  try {
    const user = await requireUser();
    const subscriptionService = getSubscriptionService();
    await subscriptionService.cancelSubscription(user.id);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

export const reactivateSubscription = async (): Promise<
  ActionResult<void>
> => {
  try {
    const user = await requireUser();
    const subscriptionService = getSubscriptionService();
    await subscriptionService.reactivateSubscription(user.id);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

// Helper Functions

const getSubscriptionService = (dbClient: DbClient = prisma) => {
  const factory = new ServiceFactory(dbClient);
  return factory.getSubscriptionService();
};

const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
