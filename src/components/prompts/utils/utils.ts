import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

export const isEditMode = (prompt?: DPrompt) => {
   return !!prompt;
};

export const viewPromptUrl = (prompt: DPrompt, collectionId?: string) => {
   const viewUrl = `/templates/${prompt.id}`;
   if (collectionId) {
      return `${viewUrl}?collectionId=${collectionId}`;
   }
   return viewUrl;
};

export const editPromptUrl = (prompt: DPrompt, collection?: DCollection) => {
   const editUrl = `/templates/${prompt.id}/edit`;
   if (collection) {
      return `${editUrl}?collectionId=${collection.id}`;
   }
   return editUrl;
};

export const newPromptUrl = (collection?: DCollection) => {
   if (collection) {
      return `/templates/new?collectionId=${collection.id}`;
   }
   return "/templates/new";
};

export const promptEditNavigateBackUrl = (
   prompt?: DPrompt,
   collection?: DCollection
) => {
   const isEdit = isEditMode(prompt);

   if (collection) {
      if (isEdit) {
         return `/templates/${prompt!.id}?collectionId=${collection.id}`;
      }
      return `/collections/${collection.id}`;
   }

   if (isEdit) {
      return `/templates/${prompt!.id}`;
   }

   return "/templates";
};

export const breadcrumbRootUrl = (collection?: DCollection) => {
   if (collection) {
      return `/collections/${collection.id}`;
   }
   return "/templates";
};
