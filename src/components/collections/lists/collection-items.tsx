"use client";

import { Folder, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { useLoadLibraryCollections } from "@/data/ts-queries/library";

import { CollectionCard } from "./items";

export const CollectionItems = () => {
   const { data: collections = [], isLoading } = useLoadLibraryCollections();

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {[1, 2, 3, 4].map((i) => (
                  <div
                     key={i}
                     className="h-40 animate-pulse rounded-xl border bg-white"
                  />
               ))}
            </div>
         </div>
      );
   }

   return (
      <div data-testid="collection-items">
         {collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Folder className="h-8 w-8 text-slate-400" />
               </div>
               <h2 className="mb-2 text-lg font-semibold text-slate-700">
                  Noch keine Sammlungen
               </h2>
               <p className="mb-6 max-w-sm text-sm text-slate-500">
                  Erstellen Sie Ihre erste Sammlung, um Vorlagen zu gruppieren
                  und besser zu organisieren.
               </p>
               <Button asChild className="gap-2">
                  <Link href="/collections/new">
                     <Plus className="h-4 w-4" />
                     Erste Sammlung erstellen
                  </Link>
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
   );
};
