import { isEmpty } from "es-toolkit/compat";
import { Braces } from "lucide-react";

import { getGlobalFields } from "@/data/actions/settings";

import { GlobalFieldList } from "./global-field-list";

export const GlobalTemplateFields = async () => {
   const fields = await getGlobalFields();

   const emptyState = () => {
      if (isEmpty(fields)) {
         return (
            <div
               className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center"
               data-testid="fields-empty"
            >
               <Braces className="mx-auto mb-3 h-8 w-8 text-slate-400" />
               <p className="font-medium text-slate-600">
                  Noch keine globalen Felder
               </p>
               <p className="mt-1 text-sm text-slate-400">
                  Erstellen Sie Felder, die Sie in mehreren Vorlagen
                  wiederverwenden möchten
               </p>
            </div>
         );
      }
   };

   return (
      <div className="space-y-6" data-testid="template-fields">
         <div>
            <h2 className="text-xl font-semibold text-slate-900">
               Vorlagen-Felder
            </h2>
            <p className="mt-1 text-sm text-slate-500">
               Definieren Sie wiederverwendbare Felder für Ihre Vorlagen. Diese
               können beim Erstellen einer Vorlage per Klick importiert werden.
            </p>
         </div>

         <GlobalFieldList fields={fields} />

         {emptyState()}
      </div>
   );
};
