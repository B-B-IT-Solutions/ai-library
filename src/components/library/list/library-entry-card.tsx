import { FC } from "react";
import { map } from "es-toolkit/compat";
import { Eye, MoreVertical } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DLibraryEntry } from "@/data/types/domain/library";
import { CreatePromptButton } from "../buttons/create-prompt-button-with-fields";
import { DownloadTemplateButton } from "../buttons/download-template-button";

type LibraryEntryCardProps = {
   entry: DLibraryEntry;
};

export const LibraryEntryCard: FC<LibraryEntryCardProps> = ({ entry }) => {
   const { templateDescriptor: template } = entry;

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
         className="group gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
         data-testid="library-entry-card"
      >
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
                     <DownloadTemplateButton
                        descriptor={template}
                        asMenuItem={true}
                     />
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardContent>
      </Card>
   );
};
