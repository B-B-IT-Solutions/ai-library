import { DPromptTemplateDescriptor } from "./prompt.template";

export type DLibraryEntry = {
   id: string;
   userId: string;
   orderId: string;
   templateId: string;
   productId: string;
   template: DPromptTemplateDescriptor;
   createdAt: string;
};
