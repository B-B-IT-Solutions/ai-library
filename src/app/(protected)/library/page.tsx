import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Library } from "@/components/library";
import { getLibraryEntries } from "@/data/actions/library";

export const metadata: Metadata = {
   title: "Meine Bibliothek",
};

export const LibraryPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const entries = await getLibraryEntries();

   return (
      <div data-testid="library-page">
         <Library entries={entries} />
      </div>
   );
};

export default LibraryPage;
