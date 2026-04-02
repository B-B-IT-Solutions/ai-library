import { Metadata } from "next";
import { notFound } from "next/navigation";

import { LibraryEntryView } from "@/components/library";
import { getLibraryEntry } from "@/data/actions/library";

export const metadata: Metadata = {
   title: "Vorlage",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const LibraryEntryPage = async ({ params }: PageProps) => {
   const { id: descriptorId } = await params;
   const entry = await getLibraryEntry(descriptorId);

   if (!entry) {
      return notFound();
   }

   return (
      <div
         className="h-screen bg-slate-50"
         data-testid="library-entry-view-page"
      >
         <LibraryEntryView entry={entry} />
      </div>
   );
};

export default LibraryEntryPage;
