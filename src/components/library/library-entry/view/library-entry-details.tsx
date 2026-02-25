import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { ArrowLeft, Edit2, MoreVertical } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { MDRenderer } from "@/components/shared/md";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { CreatePromptButton, DownloadTemplateButton } from "../../buttons";

import { PromptTextDisplay } from "./prompt-text-display";

type LibraryEntryDetailsProps = {
   entry: DLibraryEntryWithPromptTemplate;
};

export const LibraryEntryDetails: FC<LibraryEntryDetailsProps> = ({
   entry,
}) => {
   const { templateDescriptor: descriptor } = entry;

   const categories = () => {
      if (!isEmpty(descriptor.categories)) {
         return (
            <div className="mt-4 flex flex-wrap gap-2" data-testid="categories">
               {map(descriptor.categories, (cat) => (
                  <span
                     key={cat.name}
                     className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700"
                  >
                     {cat.name}
                  </span>
               ))}
            </div>
         );
      }
   };

   return (
      <div
         className="container mx-auto px-4 py-8"
         data-testid="library-entry-details"
      >
         <div className="mb-6">
            <Link
               href="/library"
               className="inline-flex items-center text-slate-600 hover:text-slate-900"
            >
               <ArrowLeft className="mr-2 h-4 w-4" />
               Zurück zur Bibliothek
            </Link>
         </div>

         <div className="mx-auto max-w-4xl">
            <Card className="rounded-lg border border-slate-300 bg-white">
               <CardHeader className="border-b border-slate-200">
                  <div className="flex items-start justify-between gap-4">
                     <div className="flex-1">
                        <h1 className="mb-3 text-3xl font-bold text-slate-900">
                           {descriptor.title}
                        </h1>
                        <span className="inline-block rounded-md border border-blue-200 bg-blue-100 px-3 py-1 text-sm text-blue-700">
                           {descriptor.recommendedModel}
                        </span>
                     </div>
                     <div className="flex shrink-0 items-center gap-2">
                        <CreatePromptButton descriptor={descriptor} />
                        <Link href={`/library/${entry.id}/edit`}>
                           <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer gap-2"
                              data-testid="edit-entry-button"
                           >
                              <Edit2 className="h-4 w-4" />
                              Bearbeiten
                           </Button>
                        </Link>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="cursor-pointer"
                                 data-testid="more-options-btn"
                              >
                                 <MoreVertical className="h-4 w-4" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DownloadTemplateButton
                                 descriptor={descriptor}
                                 asMenuItem
                              />
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </div>
                  {categories()}
               </CardHeader>

               <CardContent className="space-y-6 p-6">
                  <div data-testid="short-description">
                     <h2 className="mb-3 text-xl font-semibold text-slate-900">
                        Beschreibung
                     </h2>
                     <MDRenderer>{descriptor.description}</MDRenderer>
                  </div>

                  <div data-testid="long-description">
                     <h2 className="mb-3 text-xl font-semibold text-slate-900">
                        Detaillierte Beschreibung
                     </h2>
                     <MDRenderer>
                        {descriptor.promptTemplate.detailedDescription}
                     </MDRenderer>
                  </div>

                  <PromptTextDisplay template={descriptor.promptTemplate} />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};
