import { DPromptTemplate } from "./prompt.template";

export type DLibraryEntry = {
   id: string;
   userId: string;
   orderId: string;
   templateId: string;
   template: DPromptTemplate;
   createdAt: string;
};
