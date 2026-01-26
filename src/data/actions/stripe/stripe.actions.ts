"use server";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DStripeCheckoutResponse } from "@/data/types/domain/stripe";
import {
   DCreateSubscriptionCheckout,
   DSubscriptionCheckoutRequest,
} from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";
import { requireUser } from "../auth-utils";

export const createOrderCheckoutSession = async (): Promise<
   ActionResult<DStripeCheckoutResponse>
> => {
   try {
      const stripeService = getStripeService();
      const result = await stripeService.createOrderCheckoutSession();

      return {
         success: true,
         message: "Checkout session created",
         data: result,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const createSubscriptionCheckoutSession = async (
   params: DSubscriptionCheckoutRequest
): Promise<ActionResult<DStripeCheckoutResponse>> => {
   try {
      const user = await requireUser();
      const stripeService = getStripeService();

      const payload: DCreateSubscriptionCheckout = {
         userId: user.id,
         userEmail: user.email as string,
         planId: params.planId,
         billingInterval: params.billingInterval,
      };
      const data =
         await stripeService.createSubscriptionCheckoutSession(payload);
      return {
         success: true,
         message: "Subscription checkout initiated successfully",
         data,
      };
   } catch {
      return {
         success: false,
         message: "Subscription checkout couldn't be initiated",
      };
   }
};

export const cancelSubscription = async (): Promise<ActionResult<void>> => {
   try {
      const user = await requireUser();
      const stripeService = getStripeService();
      await stripeService.cancelSubscription(user.id);
      return {
         success: true,
         message: "Subscription cancelled successfully",
      };
   } catch {
      return {
         success: false,
         message: "Subscription couldn't be cancelled",
      };
   }
};

const getStripeService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getStripeService();
};
