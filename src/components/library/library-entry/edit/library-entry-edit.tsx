import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { LibraryEntryBreadcrumb } from "../library-entry-breadcrumb";

import { LibraryEntryEditForm } from "./library-entry-edit-form";

type Props = {
   entry?: DLibraryEntryWithPromptTemplate;
   globalFields: DGlobalTemplateField[];
};

export const LibraryEntryEdit = ({ entry, globalFields }: Props) => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="library-entry-edit"
      >
         <div className="border-b border-slate-200 bg-white px-6 py-3">
            {entry ? (
               <LibraryEntryBreadcrumb
                  variant="edit"
                  title={entry.templateDescriptor.title}
                  entryId={entry.id}
               />
            ) : (
               <LibraryEntryBreadcrumb variant="new" />
            )}
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl p-4">
               <LibraryEntryEditForm
                  entry={entry}
                  globalFields={globalFields}
               />
            </div>
         </div>
      </div>
   );
};
