"use client";

import { useState } from "react";
import { Globe, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { DCollection } from "@/data/types/domain/collection";
import { CollectionBreadcrumb } from "../../breadcrumbs";
import { DeleteCollectionDialog } from "../../dialogs";

type Props = {
   collection: DCollection;
};

export const CollectionHeader = ({ collection }: Props) => {
   const router = useRouter();
   const [showDelete, setShowDelete] = useState(false);

   return (
      <>
         <CollectionBreadcrumb variant="view" label={collection.name} />

         <div className="mt-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
               <div className="flex items-center gap-2">
                  <h1 className="truncate text-2xl font-bold text-slate-900">
                     {collection.name}
                  </h1>
                  {collection.isPublic && (
                     <Badge
                        variant="outline"
                        className="gap-1 border-green-300 bg-green-50 text-green-700"
                     >
                        <Globe className="h-3 w-3" />
                        Öffentlich
                     </Badge>
                  )}
               </div>
               {collection.description && (
                  <p className="mt-1 text-sm text-slate-600">
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
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={() => setShowDelete(true)}
               >
                  <Trash2 className="h-4 w-4" />
                  Löschen
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
