"use client";

import { useState } from "react";
import { map } from "es-toolkit/compat";
import { Eye, FolderPlus, MoreVertical } from "lucide-react";
import Link from "next/link";

import { AddToLibraryCollectionDialog } from "@/components/collections";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DCollection } from "@/data/types/domain/collection";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";
import {
   AddToFavoriteButton,
   DownloadTemplateButton,
   UseTemplateButton,
} from "../../buttons";

type Props = {
   descriptor: DPromptTemplateDescriptor;
   collections: DCollection[];
};

export const PublicTemplateItemCard = ({ descriptor, collections }: Props) => {
   const [showAddToCollectionDialog, setShowAddToCollectionDialog] =
      useState(false);

   const categories = () => {
      return (
         <div className="mb-2 flex flex-wrap gap-1" data-testid="categories">
            {map(descriptor.categories, (cat) => (
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

   const dropdownMenu = () => {
      return (
         <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
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
               <DropdownMenuItem asChild={true}>
                  <Link
                     href={`/templates/${descriptor.id}`}
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
                  data-testid="show-add-to-collection-dialog"
               >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Zu Sammlung hinzufügen
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DownloadTemplateButton
                  descriptor={descriptor}
                  asMenuItem={true}
               />
            </DropdownMenuContent>
         </DropdownMenu>
      );
   };

   return (
      <Card
         className="group relative gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
         data-testid="public-template-item-card"
      >
         <AddToFavoriteButton descriptor={descriptor} />
         <CardHeader className="gap-3 border-b border-slate-200 p-5 pb-3">
            <Link
               href={`/templates/${descriptor.id}`}
               className="group/title"
               data-testid="view-details-link-title"
            >
               <h4 className="cursor-pointer text-lg leading-tight font-semibold text-slate-900 transition-colors hover:text-blue-700">
                  {descriptor.title}
               </h4>
            </Link>
            <div>
               <span className="self-start rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {descriptor.recommendedModel}
               </span>
            </div>
         </CardHeader>

         <CardContent className="grid gap-3 p-5">
            {categories()}

            <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
               {descriptor.description}
            </p>

            <div className="flex gap-2 pt-2">
               <UseTemplateButton descriptor={descriptor} className="flex-1" />
               {dropdownMenu()}
            </div>
         </CardContent>

         <AddToLibraryCollectionDialog
            descriptor={descriptor}
            collections={collections}
            open={showAddToCollectionDialog}
            onOpenChange={setShowAddToCollectionDialog}
         />
      </Card>
   );
};
