import { map } from "es-toolkit/compat";

import { toDPromptTemplate } from "@/data/actions/prompt/prompt.mapper";
import { DPurchase } from "@/data/types/domain/library";

type PrismaPurchase = {
   id: string;
   userId: string;
   orderId: string;
   templateId: string;
   createdAt: Date;
   template: any;
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
