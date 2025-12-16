import { map } from "es-toolkit/compat";

import { toDPromptTemplate } from "@/data/actions/prompt/prompt.mapper";
import { DPurchase } from "@/data/types/domain/library";
import { DSubscription } from "@/data/types/domain/subscription";

type PrismaPurchase = {
   id: string;
   userId: string;
   orderId: string;
   templateId: string;
   createdAt: Date;
   template: any;
};

type PrismaSubscription = {
   id: string;
   userId: string;
   startDate: Date;
   endDate: Date;
   isActive: boolean;
   createdAt: Date;
   updatedAt: Date;
};

export const toDPurchases = (purchases: PrismaPurchase[]): DPurchase[] => {
   return map(purchases, (p) => toDPurchase(p));
};

export const toDPurchase = (purchase: PrismaPurchase): DPurchase => {
   return {
      id: purchase.id,
      userId: purchase.userId,
      orderId: purchase.orderId,
      templateId: purchase.templateId,
      template: toDPromptTemplate(purchase.template),
      createdAt: purchase.createdAt.toISOString(),
   };
};

export const toDSubscription = (
   subscription: PrismaSubscription
): DSubscription => {
   return {
      id: subscription.id,
      userId: subscription.userId,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
      isActive: subscription.isActive,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
   };
};
