import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { LibraryEntryBreadcrumb } from "../../breadcrumbs";

import { LibraryEntryViewForm } from "./library-entry-view-form";

type Props = {
   entry: DLibraryEntryWithPromptTemplate;
};

export const LibraryEntryView = ({ entry }: Props) => {
   const { templateDescriptor: descriptor } = entry;

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="library-entry-view"
      >
         <div className="border-b border-slate-200 bg-white px-6 py-3">
            <LibraryEntryBreadcrumb variant="view" title={descriptor.title} />
         </div>

         <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl p-4">
               <LibraryEntryViewForm entry={entry} />
            </div>
         </div>
      </div>
   );
};
