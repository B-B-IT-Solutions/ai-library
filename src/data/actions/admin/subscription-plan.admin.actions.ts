"use server";

import { requireAdmin } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { toDSubscriptionPlans } from "@/data/repositories/subscription/subscription.mapper";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";

export const getAdminSubscriptionPlans = async (): Promise<DSubscriptionPlan[]> => {
   await requireAdmin();
   const rawPlans = await prisma.subscriptionPlan.findMany({
      orderBy: { monthlyPrice: "asc" },
   });
   return toDSubscriptionPlans(rawPlans);
};

type SubscriptionPlanUpdateInput = {
   name: string;
   description: string;
   monthlyPrice: number;
   yearlyPrice: number;
   isActive: boolean;
};

export const updateSubscriptionPlan = async (
   planId: string,
   input: SubscriptionPlanUpdateInput
): Promise<ActionResult> => {
   try {
      await requireAdmin();

      await prisma.subscriptionPlan.update({
         where: { id: planId },
         data: {
            name: input.name,
            description: input.description,
            monthlyPrice: input.monthlyPrice,
            yearlyPrice: input.yearlyPrice,
            isActive: input.isActive,
         },
      });

      return { success: true, message: "Plan erfolgreich aktualisiert." };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
   }
};
