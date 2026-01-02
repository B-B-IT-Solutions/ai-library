"use server";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { ActionResult } from "@/data/types/utils";

type CheckoutResponse = {
   sessionId: string;
   url: string;
};

export const createCheckoutSession = async (): Promise<
   ActionResult<CheckoutResponse>
> => {
   try {
      const stripeService = getStripeService();
      const result = await stripeService.createCheckoutSession();

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

const getStripeService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getStripeService();
};
