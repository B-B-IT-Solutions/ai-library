import { DPromptTemplate } from "./prompt.template";

export type DPurchase = {
   id: string;
   userId: string;
   orderId: string;
   templateId: string;
   template: DPromptTemplate;
   createdAt: string;
};

export type DLibraryTemplate = DPromptTemplate & {
   purchasedAt: string;
   accessType: "PURCHASED";
};
