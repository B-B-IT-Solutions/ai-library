import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

export const isEditMode = (prompt?: DPrompt) => {
   return !!prompt;
};

export const viewPromptUrl = (
   prompt: DPrompt,
   collection?: DCollectionPreview
) => {
   const viewUrl = `/prompts/${prompt.id}`;
   if (collection) {
      return `${viewUrl}?collectionId=${collection.id}`;
   }
   return viewUrl;
};

export const editPromptUrl = (
   prompt: DPrompt,
   collection?: DCollectionPreview
) => {
   const editUrl = `/prompts/${prompt.id}/edit`;
   if (collection) {
      return `${editUrl}?collectionId=${collection.id}`;
   }
   return editUrl;
};

export const newPromptUrl = (collection?: DCollectionPreview) => {
   if (collection) {
      return `/prompts/new?collectionId=${collection.id}`;
   }
   return "/prompts/new";
};

export const promptEditNavigateBackUrl = (
   prompt?: DPrompt,
   collection?: DCollectionPreview
) => {
   const isEdit = isEditMode(prompt);

   if (collection) {
      if (isEdit) {
         return `/prompts/${prompt!.id}?collectionId=${collection.id}`;
      }
      return `/collections/${collection.id}`;
   }

   if (isEdit) {
      return `/prompts/${prompt!.id}`;
   }

   return "/prompts";
};

export const breadcrumbRootUrl = (collection?: DCollectionPreview) => {
   if (collection) {
      return `/collections/${collection.id}`;
   }
   return "/prompts";
};
