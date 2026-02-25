import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { ReturnToLibraryButton } from "../buttons";

import { EditLibraryEntryForm } from "./edit-library-entry-form";

type Props = {
   entry: DLibraryEntryWithPromptTemplate;
};

export const LibraryEntryEdit = ({ entry }: Props) => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="library-entry-edit"
      >
         <div className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Vorlage bearbeiten
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-600">
                     {entry.templateDescriptor.title}
                  </p>
               </div>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="mx-auto max-w-5xl p-4">
               <div className="mb-4">
                  <ReturnToLibraryButton />
               </div>
               <EditLibraryEntryForm entry={entry} />
            </div>
         </div>
      </div>
   );
};
