import { isConflictingPromptCategoryName } from "@/data/actions/prompt";
import { updatePromptCategorySchema } from "@/data/types/validators/prompt";

/**
 * Category schema that additionally validates, against the backend, that no
 * other category of the current user already has the given name. Kept in its
 * own file (instead of `template.schema.ts`) so the rest of the prompt
 * schemas stay free of a dependency on the actions layer.
 */
export const updateCategorySchemaBackendValidation = (categoryId?: number) => {
   return updatePromptCategorySchema.refine(
      async (data) => {
         const isConflict = await isConflictingPromptCategoryName(
            categoryId,
            data.name
         );
         return !isConflict;
      },
      {
         message: "Es existiert bereits eine Kategorie mit diesem Namen",
         path: ["name"],
      }
   );
};
