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
import { CreatePromptButton } from "../buttons/create-prompt-button";
import { DownloadTemplateButton } from "../buttons/download-template-button";

type LibraryEntryCardProps = {
   entry: DLibraryEntry;
};

export const LibraryEntryCard: FC<LibraryEntryCardProps> = ({ entry }) => {
   const { template } = entry;

   const categories = () => {
      return (
         <div className="flex flex-wrap gap-1 mb-2" data-testid="categories">
            {map(template.categories, (cat) => (
               <span
                  key={cat.name}
                  className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
               >
                  {cat.name}
               </span>
            ))}
         </div>
      );
   };

   return (
      <Card
         className="group p-0 gap-0 bg-white border border-slate-300 rounded-lg hover:border-slate-400 hover:shadow-md transition-all duration-200"
         data-testid="library-entry-card"
      >
         <CardHeader className="p-5 pb-3 gap-3 border-b border-slate-200">
            <Link href={`/library/${entry.id}`} className="group/title">
               <h4 className="font-semibold text-lg text-slate-900 leading-tight hover:text-blue-700 transition-colors cursor-pointer">
                  {template.title}
               </h4>
            </Link>
            <div>
               <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 self-start font-medium">
                  {template.recommendedModel}
               </span>
            </div>
         </CardHeader>

         <CardContent className="p-5 grid gap-3">
            {categories()}
            <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
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
                        <MoreVertical className="w-4 h-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem asChild>
                        <Link
                           href={`/library/${entry.id}`}
                           className="cursor-pointer"
                           data-testid="view-details-link"
                        >
                           <Eye className="w-4 h-4 mr-2" />
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
