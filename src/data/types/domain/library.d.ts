import {
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
} from "./prompt.template";

export type DLibraryEntry = {
   id: string;
   userId: string;
   templateDescriptorId: string;
   templateDescriptor: DPromptTemplateDescriptor;
   createdAt: string;
};

export type DLibraryEntryWithPromptTemplate = DLibraryEntry & {
   templateDescriptor: DPromptTemplateDescriptorWithTemplate;
};
