import { FC, useState } from "react";
import { map } from "es-toolkit/compat";
import { Eye, Folder, FolderPlus, MoreVertical, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
   useLoadLibraryCollections,
   useToggleFavorite,
} from "@/data/ts-queries/library";
import { DLibraryEntry } from "@/data/types/domain/library";
import { cn } from "@/lib/utils";
import { AddToCollectionDialog } from "../actions/add-to-collection-dialog";
import { CreatePromptButton } from "../buttons/create-prompt-button";
import { DownloadTemplateButton } from "../buttons/download-template-button";

type LibraryEntryCardProps = {
   entry: DLibraryEntry;
};

export const LibraryEntryCard: FC<LibraryEntryCardProps> = ({ entry }) => {
   const { templateDescriptor: template } = entry;
   const { mutate: toggleFavorite } = useToggleFavorite();
   const { data: collections = [] } = useLoadLibraryCollections();
   const [showAddToCollectionDialog, setShowAddToCollectionDialog] =
      useState(false);

   const handleToggleFavorite = () => {
      toggleFavorite(
         { entryId: entry.id, isFavorite: !entry.isFavorite },
         {
            onSuccess: (result) => {
               if (result.success) {
                  toast.success(result.message);
               } else {
                  toast.error(result.message);
               }
            },
            onError: () => {
               toast.error("Fehler beim Aktualisieren der Favoriten");
            },
         }
      );
   };

   const getCollectionName = (collectionId: string) => {
      const collection = collections.find((c) => c.id === collectionId);
      return collection?.name || "Unbekannt";
   };

   const categories = () => {
      return (
         <div className="mb-2 flex flex-wrap gap-1" data-testid="categories">
            {map(template.categories, (cat) => (
               <span
                  key={cat.name}
                  className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
               >
                  {cat.name}
               </span>
            ))}
         </div>
      );
   };

   return (
      <Card
         className="group relative gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
         data-testid="library-entry-card"
      >
         {/* Favorite Button */}
         <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 shadow-sm transition-all hover:bg-white"
            aria-label={
               entry.isFavorite
                  ? "Aus Favoriten entfernen"
                  : "Zu Favoriten hinzufügen"
            }
            aria-pressed={entry.isFavorite}
         >
            <Star
               className={cn(
                  "h-4 w-4 transition-colors",
                  entry.isFavorite
                     ? "fill-yellow-400 text-yellow-400"
                     : "text-slate-400 hover:text-yellow-400"
               )}
            />
         </button>
         <CardHeader className="gap-3 border-b border-slate-200 p-5 pb-3">
            <Link href={`/library/${entry.id}`} className="group/title">
               <h4 className="cursor-pointer text-lg leading-tight font-semibold text-slate-900 transition-colors hover:text-blue-700">
                  {template.title}
               </h4>
            </Link>
            <div>
               <span className="self-start rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {template.recommendedModel}
               </span>
            </div>
         </CardHeader>

         <CardContent className="grid gap-3 p-5">
            {categories()}

            {/* Collection Badges */}
            {entry.collections.length > 0 && (
               <div className="flex flex-wrap gap-1">
                  {map(entry.collections.slice(0, 3), (collectionId) => (
                     <span
                        key={collectionId}
                        className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                     >
                        <Folder className="mr-1 h-3 w-3" />
                        {getCollectionName(collectionId)}
                     </span>
                  ))}
                  {entry.collections.length > 3 && (
                     <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        +{entry.collections.length - 3} mehr
                     </span>
                  )}
               </div>
            )}

            <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
               {template.description}
            </p>

            <div className="flex gap-2 pt-2">
               <CreatePromptButton descriptor={template} className="flex-1" />
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        data-testid="dropdown-menu-btn"
                     >
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem asChild>
                        <Link
                           href={`/library/${entry.id}`}
                           className="cursor-pointer"
                           data-testid="view-details-link"
                        >
                           <Eye className="mr-2 h-4 w-4" />
                           Details anzeigen
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => setShowAddToCollectionDialog(true)}
                        className="cursor-pointer"
                     >
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Zu Sammlung hinzufügen
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DownloadTemplateButton
                        descriptor={template}
                        asMenuItem={true}
                     />
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardContent>

         {/* Add to Collection Dialog */}
         <AddToCollectionDialog
            entryId={entry.id}
            currentCollections={entry.collections}
            open={showAddToCollectionDialog}
            onOpenChange={setShowAddToCollectionDialog}
         />
      </Card>
   );
};
