import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

export const isEditMode = (prompt?: DPrompt) => {
   return !!prompt;
};

export const navigateBackUrl = (
   prompt?: DPrompt,
   collection?: DCollection | null
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
