"use server";

import { requireAdmin } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DSubscriptionPlanUpdateInput } from "@/data/types/domain/admin/admin";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";

export const getAdminSubscriptionPlans = async (): Promise<
   DSubscriptionPlan[]
> => {
   await requireAdmin();
   return await getService().getSubscriptionPlans();
};

export const updateSubscriptionPlan = async (
   planId: string,
   input: DSubscriptionPlanUpdateInput
): Promise<ActionResult> => {
   try {
      await requireAdmin();
      await getService().updateSubscriptionPlan(planId, input);
      return { success: true, message: "Plan erfolgreich aktualisiert." };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   return new ServiceFactory(dbClient).getAdminSubscriptionPlanService();
};
