"use server";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DStripeBillingPortalSessionResponse,
   DStripeCheckoutResponse,
} from "@/data/types/domain/stripe";
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
      const service = getService();
      const result = await service.createOrderCheckoutSession();

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

      const payload: DCreateSubscriptionCheckout = {
         userId: user.id,
         userEmail: user.email as string,
         planId: params.planId,
         billingInterval: params.billingInterval,
      };

      const data = await prisma.$transaction(async (tx) => {
         const service = getService(tx);
         return await service.createSubscriptionCheckoutSession(payload);
      });

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

      await prisma.$transaction(async (tx) => {
         const service = getService(tx);
         await service.cancelSubscription(user.id);
      });

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

export const reactivateSubscription = async (): Promise<ActionResult<void>> => {
   try {
      const user = await requireUser();

      await prisma.$transaction(async (tx) => {
         const service = getService(tx);
         await service.reactivateSubscription(user.id);
      });

      return {
         success: true,
         message: "Subscription reactivated successfully",
      };
   } catch {
      return {
         success: false,
         message: "Subscription couldn't be reactivated",
      };
   }
};

export const createCustomerPortal = async (): Promise<
   ActionResult<DStripeBillingPortalSessionResponse>
> => {
   try {
      const user = await requireUser();
      const service = getService();
      const data = await service.createPortalSession(user.id);
      return {
         success: true,
         message: "Billing Portal session created established",
         data,
      };
   } catch {
      return {
         success: false,
         message: "Billing Portal session couldn't be established",
      };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getStripeService();
};
