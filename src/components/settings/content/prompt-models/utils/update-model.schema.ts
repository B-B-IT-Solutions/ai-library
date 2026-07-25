import { isConflictingPromptModelName } from "@/data/actions/prompt";
import { updatePromptModelSchema } from "@/data/types/validators/prompt";

/**
 * Model schema that additionally validates, against the backend, that no
 * other model of the current user already has the given name. Kept in its
 * own file (instead of `template.schema.ts`) so the rest of the prompt
 * schemas stay free of a dependency on the actions layer.
 */
export const updateModelSchemaBackendValidation = (modelId?: number) => {
   return updatePromptModelSchema.refine(
      async (data) => {
         const isConflict = await isConflictingPromptModelName(
            modelId,
            data.name
         );
         return !isConflict;
      },
      {
         message: "Es existiert bereits ein Modell mit diesem Namen",
         path: ["name"],
      }
   );
};
