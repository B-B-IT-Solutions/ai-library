import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { LibraryEntryDetails } from "@/components/library";
import { getLibraryEntry } from "@/data/actions/library";

export const metadata: Metadata = {
   title: "Vorlage",
};

export type LibraryEntryPageParams = {
   id: string;
};

export type LibraryEntryPageProps = {
   params: Promise<LibraryEntryPageParams>;
};

export const LibraryEntryPage = async ({ params }: LibraryEntryPageProps) => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const { id: entryId } = await params;
   const entry = await getLibraryEntry(entryId);

   if (!entry) {
      return notFound();
   }

   return (
      <div data-testid="library-entry-page">
         <LibraryEntryDetails entry={entry} />
      </div>
   );
};

export default LibraryEntryPage;
