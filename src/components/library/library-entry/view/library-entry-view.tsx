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
         <div className="border-b border-slate-200 bg-white px-6 py-5">
            <h1 className="text-2xl font-bold text-slate-900">
               {descriptor.title}
            </h1>
            {/* <p className="mt-0.5 text-sm text-slate-600">
               {descriptor.description}
            </p> */}
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-3 pb-3.5">
               <LibraryEntryBreadcrumb
                  variant="view"
                  title={descriptor.title}
               />
            </div>
            <div className="mx-auto max-w-5xl">
               <LibraryEntryViewForm entry={entry} />
            </div>
         </div>
      </div>
   );
};
