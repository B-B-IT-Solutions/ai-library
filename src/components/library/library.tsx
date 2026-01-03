import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { BookOpen } from "lucide-react";
import Link from "next/link";

import { LibraryEntryCard } from "@/components/library/library-entry-card";
import { Button } from "@/components/shadcn/button";
import { DLibraryEntry } from "@/data/types/domain/library";

type LibraryProps = {
   entries: DLibraryEntry[];
};

export const Library: FC<LibraryProps> = ({ entries }) => {
   if (isEmpty(entries)) {
      return (
         <div className="container mx-auto px-4 py-8" data-testid="library">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
               Meine Bibliothek
            </h1>
            <div
               className="text-center py-12"
               data-testid="library-items-empty"
            >
               <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Ihre Bibliothek ist leer
               </h2>
               <p className="text-slate-600 mb-6">
                  Kaufen Sie Vorlagen oder abonnieren Sie, um auf Ihre
                  Bibliothek zuzugreifen
               </p>
               <Link href="/marketplace">
                  <Button>Marktplatz durchsuchen</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8" data-testid="library">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
               Meine Bibliothek
            </h1>
            <p className="text-slate-600">
               Greifen Sie auf Ihre Vorlagen zu und verwalten Sie diese
            </p>
         </div>

         <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="library-items"
         >
            {map(entries, (entry) => (
               <LibraryEntryCard key={entry.id} entry={entry} />
            ))}
         </div>
      </div>
   );
};
