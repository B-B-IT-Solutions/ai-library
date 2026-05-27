import { DCollection } from "@/data/types/domain/collection";
import { DPrompt } from "@/data/types/domain/prompt";

export const isEdit = (prompt?: DPrompt) => {
   return !!prompt;
};

export const navigateBackUrl = (
   prompt?: DPrompt,
   collection?: DCollection | null
) => {
   const edit = isEdit(prompt);

   if (collection) {
      if (edit) {
         return `/templates/${prompt!.id}?collectionId=${collection.id}`;
      }
      return `/collections/${collection.id}`;
   }

   if (edit) {
      return `/templates/${prompt!.id}`;
   }

   return "/templates";
};
