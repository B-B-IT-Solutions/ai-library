import { Metadata } from "next";

import { NewLibraryEntry } from "@/components/library";

export const metadata: Metadata = {
   title: "Neue Vorlage erstellen",
};

export const NewLibraryEntryPage = async () => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-library-entry-page"
      >
         <NewLibraryEntry />
      </div>
   );
};

export default NewLibraryEntryPage;
