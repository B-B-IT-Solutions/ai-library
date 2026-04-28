"use client";

import { useState } from "react";
import { ChevronLeft, Globe, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { DCollection } from "@/data/types/domain/collection";
import { DeleteCollectionDialog } from "../../dialogs";

type Props = {
   collection: DCollection;
};

export const CollectionHeader = ({ collection }: Props) => {
   const router = useRouter();
   const [showDelete, setShowDelete] = useState(false);

   return (
      <>
         <Link
            href="/collections"
            className="mb-4 flex w-fit items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
         >
            <ChevronLeft className="h-4 w-4" />
            Sammlungen
         </Link>

         <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
               <div className="flex items-center gap-2">
                  <h1 className="truncate text-2xl font-bold text-slate-900">
                     {collection.name}
                  </h1>
                  {collection.isPublic && (
                     <Globe className="h-4 w-4 shrink-0 text-green-600" />
                  )}
               </div>
               {collection.description && (
                  <p className="mt-1 text-sm text-slate-500">
                     {collection.description}
                  </p>
               )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
               <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href={`/collections/${collection.id}/edit`}>
                     <Pencil className="h-4 w-4" />
                     Bearbeiten
                  </Link>
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDelete(true)}
               >
                  <Trash2 className="h-4 w-4" />
               </Button>
            </div>
         </div>

         <DeleteCollectionDialog
            collection={collection}
            open={showDelete}
            onOpenChange={setShowDelete}
            onDeleted={() => router.push("/collections")}
         />
      </>
   );
};
