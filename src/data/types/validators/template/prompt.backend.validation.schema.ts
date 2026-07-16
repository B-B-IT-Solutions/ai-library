import { isConflictingPromptCategoryName } from "@/data/actions/prompt";

import { updateCategorySchema } from "./template.schema";

/**
 * Rename-category schema that additionally validates, against the backend,
 * that no other category of the current user already has the given name.
 * Kept in its own file (instead of `template.schema.ts`) so the rest of the
 * template/prompt schemas stay free of a dependency on the actions layer -
 * only this specific, backend-checked schema needs it.
 *
 * Intentionally not re-exported from `./index`: importing it there would
 * make the whole validators barrel depend on `@/data/actions/prompt`, which
 * itself imports schemas from that barrel - a circular dependency. Import
 * this file directly wherever the rename dialog needs it.
 */
export const updateCategorySchemaBackendValidation = (categoryId: number) => {
   return updateCategorySchema.refine(
      async (data) =>
         await isConflictingPromptCategoryName(categoryId, data.name),
      {
         message: "Es existiert bereits eine Kategorie mit diesem Namen",
         path: ["name"],
      }
   );
};
