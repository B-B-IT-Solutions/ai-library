"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Folder, Globe, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DLibraryCollection } from "@/data/types/domain/collection";

import { DeleteCollectionDialog } from "./delete-collection-dialog";

type Props = {
   collection: DLibraryCollection;
};

export const CollectionHeader: FC<Props> = ({ collection }) => {
   const router = useRouter();
   const [showDelete, setShowDelete] = useState(false);

   const iconColor = collection.color ?? "#64748b";

   return (
      <>
         <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
               <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${iconColor}20` }}
               >
                  <Folder className="h-5 w-5" style={{ color: iconColor }} />
               </div>
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
                     <p className="mt-0.5 truncate text-sm text-slate-500">
                        {collection.description}
                     </p>
                  )}
                  <p className="mt-0.5 text-xs text-slate-400">
                     {collection.templateCount}{" "}
                     {collection.templateCount === 1 ? "Vorlage" : "Vorlagen"}
                  </p>
               </div>
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
