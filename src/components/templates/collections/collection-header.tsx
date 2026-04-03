"use client";

import { FC, useState } from "react";
import {
   Folder,
   Globe,
   MoreVertical,
   Pencil,
   Share2,
   Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DLibraryCollection } from "@/data/types/domain/library";

import { DeleteCollectionDialog } from "./delete-collection-dialog";
import { EditCollectionDialog } from "./edit-collection-dialog";
import { ShareCollectionDialog } from "./share-collection-dialog";

type Props = {
   collection: DLibraryCollection;
};

export const CollectionHeader: FC<Props> = ({ collection }) => {
   const router = useRouter();
   const [showEdit, setShowEdit] = useState(false);
   const [showDelete, setShowDelete] = useState(false);
   const [showShare, setShowShare] = useState(false);

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
               <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowShare(true)}
               >
                  <Share2 className="h-4 w-4" />
                  Teilen
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Bearbeiten
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => setShowDelete(true)}
                        className="text-destructive focus:text-destructive"
                     >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Löschen
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         <EditCollectionDialog
            collection={collection}
            open={showEdit}
            onOpenChange={setShowEdit}
         />
         <DeleteCollectionDialog
            collection={collection}
            open={showDelete}
            onOpenChange={setShowDelete}
            onDeleted={() => router.push("/templates")}
         />
         <ShareCollectionDialog
            collection={collection}
            open={showShare}
            onOpenChange={setShowShare}
         />
      </>
   );
};
