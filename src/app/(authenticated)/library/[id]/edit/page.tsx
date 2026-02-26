import { Metadata } from "next";
import { notFound } from "next/navigation";

import { LibraryEntryEdit } from "@/components/library";
import { getLibraryEntry } from "@/data/actions/library";

export const metadata: Metadata = {
   title: "Vorlage Bearbeiten",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const EditLibraryEntryPage = async ({ params }: PageProps) => {
   const { id: entryId } = await params;

   const entry = await getLibraryEntry(entryId);

   if (!entry) {
      return notFound();
   }

   return (
      <div
         className="h-screen bg-slate-50"
         data-testid="library-entry-edit-page"
      >
         <LibraryEntryEdit entry={entry} />
      </div>
   );
};

export default EditLibraryEntryPage;
