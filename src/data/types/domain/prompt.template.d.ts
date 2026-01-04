export type DPromptTemplateCategory = {
   name: string;
};

export type DPromptTemplate = {
   id: string;
   detailedDescription: string;
   promptText: string;
   updatedAt: string;
   createdAt: string;
};

export type DPromptTemplateDescriptor = {
   id: string;
   title: string;
   description: string;
   recommendedModel: string;
   categories: DPromptTemplateCategory[];
   promptTemplateId: string;
   updatedAt: string;
   createdAt: string;
};

export type DPromptTemplateDescriptorWithPrompt = DPromptTemplateDescriptor & {
   promptTemplate: DPromptTemplate;
};
