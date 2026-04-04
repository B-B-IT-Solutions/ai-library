import { ArrowLeft, Folder } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { CreateCollectionForm } from "@/components/collections/collection";

export const metadata: Metadata = {
   title: "Neue Sammlung",
};

const NewCollectionPage = () => {
   return (
      <div
         className="flex h-full flex-col bg-slate-50"
         data-testid="new-collection-page"
      >
         {/* Header */}
         <div className="border-b bg-white px-6 py-4">
            <div className="flex items-center gap-3">
               <Link
                  href="/templates/collections"
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
               >
                  <ArrowLeft className="h-4 w-4" />
                  Sammlungen
               </Link>
            </div>
         </div>

         {/* Content */}
         <div className="flex flex-1 items-start justify-center overflow-y-auto p-8">
            <div className="w-full max-w-lg">
               <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                     <Folder className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                     <h1 className="text-xl font-bold text-slate-900">
                        Neue Sammlung erstellen
                     </h1>
                     <p className="text-sm text-slate-500">
                        Danach können Sie Vorlagen direkt hinzufügen.
                     </p>
                  </div>
               </div>

               <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <CreateCollectionForm />
               </div>
            </div>
         </div>
      </div>
   );
};

export default NewCollectionPage;
