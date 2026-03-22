import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { LibraryEntryBreadcrumb } from "../../breadcrumbs";

import { LibraryEntryEditForm } from "./library-entry-edit-form";

type Props = {
   entry?: DLibraryEntryWithPromptTemplate;
   globalFields: DGlobalTemplateField[];
};

export const LibraryEntryEdit = ({ entry, globalFields }: Props) => {
   const header = () => {
      const title = entry ? "Vorlage Bearbeiten" : "Neue Vorlage Erstellen";
      const text = entry
         ? "Bearbeiten Sie die Vorlage"
         : "Erstellen Sie eine neue Vorlage";

      return (
         <>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{text}</p>
         </>
      );
   };

   const breadcrumbs = () => {
      if (entry) {
         return (
            <LibraryEntryBreadcrumb
               variant="edit"
               title={entry.templateDescriptor.title}
               entryId={entry.id}
            />
         );
      }
      return <LibraryEntryBreadcrumb variant="new" />;
   };

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="library-entry-edit"
      >
         <div className="border border-slate-200 bg-white px-6 py-4">
            {header()}
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-3 pb-3.5">{breadcrumbs()}</div>
            <div className="mx-auto max-w-5xl">
               <LibraryEntryEditForm
                  entry={entry}
                  globalFields={globalFields}
               />
            </div>
         </div>
      </div>
   );
};
