import { FC } from "react";
import { isEmpty } from "es-toolkit/compat";
import { BookOpen } from "lucide-react";

import { DLibraryEntry } from "@/data/types/domain/library";

import { CreateLibraryEntryButton } from "./buttons/create-library-entry-button";
import { LibraryEntries } from "./library-entries";

type LibraryProps = {
   entries: DLibraryEntry[];
};

export const Library: FC<LibraryProps> = ({ entries }) => {
   if (isEmpty(entries)) {
      return (
         <div className="container mx-auto px-4 py-8" data-testid="library">
            <h1 className="mb-8 text-3xl font-bold text-slate-900">
               Meine Bibliothek
            </h1>
            <div className="py-12 text-center" data-testid="library-empty">
               <BookOpen className="mx-auto mb-4 h-16 w-16 text-slate-300" />
               <h2 className="mb-2 text-xl font-semibold text-slate-900">
                  Ihre Bibliothek ist leer
               </h2>
               <p className="mb-6 text-slate-600">
                  Estellen Sie Vorlagen oder abonnieren Sie, um auf Ihre
                  Bibliothek zuzugreifen
               </p>
               <CreateLibraryEntryButton />
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8" data-testid="library">
         <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
               <h1 className="text-3xl font-bold text-slate-900">
                  Meine Bibliothek
               </h1>
               <CreateLibraryEntryButton />
            </div>
            <p className="text-slate-600">
               Greifen Sie auf Ihre Vorlagen zu und verwalten Sie diese
            </p>
         </div>
         <LibraryEntries entries={entries} />
      </div>
   );
};
