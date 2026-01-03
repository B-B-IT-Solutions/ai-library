import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { LibraryEntryDetails } from "@/components/library";
import { getLibraryEntryByTemplateId } from "@/data/actions/library/library.actions";

type LibraryDetailPage = {
   params: Promise<{
      id: string;
   }>;
};

export default async function LibraryDetailPage({ params }: LibraryDetailPage) {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const { id } = await params;
   const result = await getLibraryEntryByTemplateId(id);

   if (!result.success || !result.data) {
      return notFound();
   }

   return (
      <div data-testid="library-entry-page">
         <LibraryEntryDetails entry={result.data} />
      </div>
   );
}
