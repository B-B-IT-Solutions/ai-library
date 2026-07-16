import { isEmpty, map } from "es-toolkit/compat";
import { Cpu } from "lucide-react";

import { getPromptModelsWithUsage } from "@/data/actions/prompt";
import { DPromptModelWithUsage } from "@/data/types/domain/prompt";

import { CreateModelButton } from "./buttons";
import { ModelItem } from "./item";

export const Models = async () => {
   const models = await getPromptModelsWithUsage();

   const emptyState = () => {
      if (isEmpty(models)) {
         return (
            <div
               className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center"
               data-testid="models-empty"
            >
               <Cpu className="mx-auto mb-3 h-8 w-8 text-slate-400" />
               <p className="font-medium text-slate-600">Noch keine Modelle</p>
               <p className="mt-1 text-sm text-slate-400">
                  Erstelle dein erstes Modell oder weise es direkt einem
                  Prompt zu
               </p>
            </div>
         );
      }
   };

   const renderModel = (model: DPromptModelWithUsage) => {
      return <ModelItem model={model} key={model.id} />;
   };

   const renderModels = () => {
      return (
         <div className="space-y-4">
            <div className="flex justify-end">
               <CreateModelButton />
            </div>

            <div className="space-y-2">{map(models, renderModel)}</div>
         </div>
      );
   };

   return (
      <div className="space-y-4" data-testid="prompt-models">
         <div>
            <h2 className="text-xl font-semibold text-slate-900">Modelle</h2>
            <p className="mt-1 text-sm text-slate-500">
               Verwalte deine Modelle. Änderungen wirken sich auf alle
               verknüpften Prompts aus.
            </p>
         </div>

         {renderModels()}

         {emptyState()}
      </div>
   );
};
