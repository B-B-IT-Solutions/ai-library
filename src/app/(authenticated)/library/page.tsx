import { Metadata } from "next";

import { Library } from "@/components/library";
import { getLibraryEntries } from "@/data/actions/library";

export const metadata: Metadata = {
   title: "Meine Bibliothek",
};

export const LibraryPage = async () => {
   const entries = await getLibraryEntries();

   return (
      <div data-testid="library-page">
         <Library entries={entries} />
      </div>
   );
};

export default LibraryPage;
