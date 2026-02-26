import { Metadata } from "next";

import { LibraryEntryEdit } from "@/components/library";
import { getGlobalFields } from "@/data/actions/global-field";

export const metadata: Metadata = {
   title: "Neue Vorlage erstellen",
};

export const NewLibraryEntryPage = async () => {
   const globalFields = await getGlobalFields();

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-library-entry-page"
      >
         <LibraryEntryEdit globalFields={globalFields} />
      </div>
   );
};

export default NewLibraryEntryPage;
