"use client";

import { useState } from "react";
import { Folder, Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { useLoadLibraryCollections } from "@/data/ts-queries/library";

import { CollectionCard } from "./collections/collection-card";
import { LibraryCollectionCreateDialog } from "./collections/create-library-collection-dialog";

export const CollectionsDashboard = () => {
   const { data: collections = [], isLoading } = useLoadLibraryCollections();
   const [showCreate, setShowCreate] = useState(false);

   return (
      <>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="collections-dashboard"
         >
            {/* Header */}
            <div className="border-b bg-white px-6 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900">
                        Sammlungen
                     </h1>
                     <p className="mt-1 text-sm text-slate-500">
                        Organisieren Sie Ihre Vorlagen in Sammlungen
                     </p>
                  </div>
                  <Button
                     onClick={() => setShowCreate(true)}
                     className="gap-2"
                     data-testid="create-collection-btn"
                  >
                     <Plus className="h-4 w-4" />
                     Neue Sammlung
                  </Button>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
               {isLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                     {[1, 2, 3, 4].map((i) => (
                        <div
                           key={i}
                           className="h-40 animate-pulse rounded-xl border bg-white"
                        />
                     ))}
                  </div>
               ) : collections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                     <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Folder className="h-8 w-8 text-slate-400" />
                     </div>
                     <h2 className="mb-2 text-lg font-semibold text-slate-700">
                        Noch keine Sammlungen
                     </h2>
                     <p className="mb-6 max-w-sm text-sm text-slate-500">
                        Erstellen Sie Ihre erste Sammlung, um Vorlagen zu
                        gruppieren und besser zu organisieren.
                     </p>
                     <Button
                        onClick={() => setShowCreate(true)}
                        className="gap-2"
                     >
                        <Plus className="h-4 w-4" />
                        Erste Sammlung erstellen
                     </Button>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                     {collections.map((collection) => (
                        <CollectionCard key={collection.id} collection={collection} />
                     ))}
                  </div>
               )}
            </div>
         </div>

         <LibraryCollectionCreateDialog
            open={showCreate}
            onOpenChange={setShowCreate}
         />
      </>
   );
};
