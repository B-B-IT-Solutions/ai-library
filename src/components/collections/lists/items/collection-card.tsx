"use client";

import { FC, useState } from "react";
import {
   Folder,
   Globe,
   Lock,
   MoreHorizontal,
   Pencil,
   Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DCollection } from "@/data/types/domain/collection";
import { DeleteCollectionDialog } from "../../dialogs";

type Props = {
   collection: DCollection;
   onDeleted?: () => void;
};

export const CollectionCard: FC<Props> = ({ collection, onDeleted }) => {
   const router = useRouter();
   const [showDelete, setShowDelete] = useState(false);

   const iconColor = collection.color ?? "#64748b";

   return (
      <>
         <div
            className="group relative flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            data-testid={`collection-card-${collection.id}`}
         >
            {/* Actions Menu – only on hover */}
            <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => e.preventDefault()}
                     >
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                     <DropdownMenuItem
                        onClick={(e) => {
                           e.preventDefault();
                           router.push(`/collections/${collection.id}/edit`);
                        }}
                     >
                        <Pencil className="mr-2 h-4 w-4" />
                        Bearbeiten
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={(e) => {
                           e.preventDefault();
                           setShowDelete(true);
                        }}
                        className="text-destructive focus:text-destructive"
                     >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Löschen
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>

            {/* Clickable area → collection detail */}
            <Link
               href={`/collections/${collection.id}`}
               className="flex flex-1 flex-col gap-3"
            >
               {/* Icon + Name */}
               <div className="flex items-center gap-3">
                  <div
                     className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                     style={{ backgroundColor: `${iconColor}20` }}
                  >
                     <Folder className="h-5 w-5" style={{ color: iconColor }} />
                  </div>
                  <div className="min-w-0">
                     <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold text-slate-900">
                           {collection.name}
                        </span>
                        {collection.isPublic ? (
                           <Globe className="h-3.5 w-3.5 shrink-0 text-green-600" />
                        ) : (
                           <Lock className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                        )}
                     </div>
                  </div>
               </div>

               {/* Description */}
               {collection.description ? (
                  <p className="line-clamp-2 text-sm text-slate-500">
                     {collection.description}
                  </p>
               ) : (
                  <p className="text-sm text-slate-300 italic">
                     Keine Beschreibung
                  </p>
               )}

               {/* Footer: template count */}
               <div className="mt-auto pt-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                     {collection.templateCount}{" "}
                     {collection.templateCount === 1 ? "Vorlage" : "Vorlagen"}
                  </Badge>
               </div>
            </Link>
         </div>

         <DeleteCollectionDialog
            collection={collection}
            open={showDelete}
            onOpenChange={setShowDelete}
            onDeleted={onDeleted}
         />
      </>
   );
};
