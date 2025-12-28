import { isEmpty, map } from "es-toolkit/compat";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LibraryEntryCard } from "@/components/library/library-entry-card";
import { Button } from "@/components/shadcn/button";
import { getLibraryEntries } from "@/data/actions/library/library.actions";

export default async function LibraryPage() {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const entries = await getLibraryEntries();

   if (isEmpty(entries)) {
      return (
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
               My Library
            </h1>
            <div className="text-center py-12">
               <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Your library is empty
               </h2>
               <p className="text-slate-600 mb-6">
                  Purchase templates or subscribe to access your library
               </p>
               <Link href="/marketplace">
                  <Button>Browse Marketplace</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
               My Library
            </h1>
            <p className="text-slate-600">
               Access and manage your purchased templates
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {map(entries, (entry) => (
               <LibraryEntryCard key={entry.id} entry={entry} />
            ))}
         </div>
      </div>
   );
}
