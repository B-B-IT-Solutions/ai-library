import { DPromptTemplateDescriptor } from "./prompt.template";

export type DLibraryEntry = {
   id: string;
   userId: string;
   orderId: string;
   templateDescriptorId: string;
   productId: string;
   templateDescriptor: DPromptTemplateDescriptor;
   createdAt: string;
};

export type DLibraryEntryWithPromptTemplate = DLibraryEntry & {
   templateDescriptor: DPromptTemplateDescriptorWithPrompt;
};
