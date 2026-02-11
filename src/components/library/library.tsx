import { FC } from "react";
import { isEmpty } from "es-toolkit/compat";
import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DLibraryEntry } from "@/data/types/domain/library";

import { CreateTemplateButton } from "./buttons/create-template-button";
import { LibraryEntries } from "./library-entries";

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
            <div className="text-center py-12" data-testid="library-empty">
               <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Ihre Bibliothek ist leer
               </h2>
               <p className="text-slate-600 mb-6">
                  Kaufen Sie Vorlagen oder abonnieren Sie, um auf Ihre
                  Bibliothek zuzugreifen
               </p>
               <Link href="/marketplace" data-testid="marketplace-link">
                  <Button>Marktplatz durchsuchen</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8" data-testid="library">
         <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
               <h1 className="text-3xl font-bold text-slate-900">
                  Meine Bibliothek
               </h1>
               <CreateTemplateButton />
            </div>
            <p className="text-slate-600">
               Greifen Sie auf Ihre Vorlagen zu und verwalten Sie diese
            </p>
         </div>
         <LibraryEntries entries={entries} />
      </div>
   );
};
