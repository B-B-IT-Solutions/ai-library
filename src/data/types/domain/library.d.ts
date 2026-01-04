import { DPromptTemplateDescriptor } from "./prompt.template";

export type DLibraryEntry = {
   id: string;
   userId: string;
   orderId: string;
   templateId: string;
   productId: string;
   templateDescriptor: DPromptTemplateDescriptor;
   createdAt: string;
};
