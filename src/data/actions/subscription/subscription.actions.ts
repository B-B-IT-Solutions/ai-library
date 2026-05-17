"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DSubscription,
   DSubscriptionPlan,
   DTrialStatus,
} from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";
import { formatError } from "../utils";

export const getSubscriptionPlans = async (): Promise<DSubscriptionPlan[]> => {
   await requireUser();
   const service = getService();
   return await service.getAvailablePlans();
};

export const getSubscription = async (): Promise<DSubscription | null> => {
   const user = await requireUser();
   const service = getService();
   return await service.getSubscription(user.id);
};

export const getHasActiveAccess = async (): Promise<boolean> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.hasActiveAccess(user.id);
   } catch (error) {
      console.error(formatError(error));
      return false;
   }
};

export const getTrialStatus = async (): Promise<DTrialStatus | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTrialStatus(user.id);
   } catch {
      return null;
   }
};

/**
 * Called when the user consciously selects the FREE plan after trial expiry.
 * Sets `planChosenAt` on the user record so `hasActiveAccess` returns `true`
 * and the plan-gate disappears.
 */
export const chooseFreeplan = async (): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const service = getService();
      await service.setPlanChosen(user.id);
      revalidatePath("/", "layout");
      return { success: true, message: "Plan erfolgreich gewählt" };
   } catch {
      return {
         success: false,
         message: "Fehler beim Wählen des Plans",
      };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSubscriptionService();
};
