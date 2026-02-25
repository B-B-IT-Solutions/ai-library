import { Metadata } from "next";
import { notFound } from "next/navigation";

import { LibraryEntryEdit } from "@/components/library";
import { getLibraryEntry } from "@/data/actions/library";

export const metadata: Metadata = {
   title: "Vorlage bearbeiten",
};

export type EditLibraryEntryPageParams = {
   id: string;
};

export type EditLibraryEntryPageProps = {
   params: Promise<EditLibraryEntryPageParams>;
};

export const EditLibraryEntryPage = async ({
   params,
}: EditLibraryEntryPageProps) => {
   const { id: entryId } = await params;
   const entry = await getLibraryEntry(entryId);

   if (!entry) {
      return notFound();
   }

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="edit-library-entry-page"
      >
         <LibraryEntryEdit entry={entry} />
      </div>
   );
};

export default EditLibraryEntryPage;
