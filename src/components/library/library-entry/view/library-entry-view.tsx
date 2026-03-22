import { isEmpty, map } from "es-toolkit/compat";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { MDRenderer } from "@/components/shared/md";
import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { LibraryEntryBreadcrumb } from "../../breadcrumbs";
import {
   CreatePromptFromTemplateButton,
   DownloadTemplateButton,
   EditLibraryEntryButton,
} from "../../buttons";

import { PromptTextDisplay } from "./prompt-text-display";

type Props = {
   entry: DLibraryEntryWithPromptTemplate;
};

export const LibraryEntryView = ({ entry }: Props) => {
   const { templateDescriptor: descriptor } = entry;

   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="library-entry-view"
      >
         <div className="border-b border-slate-200 bg-white px-6 py-3">
            <LibraryEntryBreadcrumb variant="view" title={descriptor.title} />
         </div>

         <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl p-4">
               <Card className="rounded-lg border border-slate-300 bg-white">
                  <CardHeader className="border-b border-slate-200">
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                           <h1 className="mb-2 text-2xl font-bold text-slate-900">
                              {descriptor.title}
                           </h1>
                           <span className="inline-block rounded-md border border-blue-200 bg-blue-100 px-3 py-1 text-sm text-blue-700">
                              {descriptor.recommendedModel}
                           </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                           <CreatePromptFromTemplateButton
                              descriptor={descriptor}
                           />
                           <EditLibraryEntryButton entry={entry} />
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild={true}>
                                 <Button
                                    variant="outline"
                                    size="icon-sm"
                                    className="cursor-pointer"
                                    data-testid="more-options-btn"
                                 >
                                    <MoreVertical className="h-4 w-4" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DownloadTemplateButton
                                    descriptor={descriptor}
                                    asMenuItem={true}
                                 />
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     </div>
                     {!isEmpty(descriptor.categories) && (
                        <div
                           className="mt-3 flex flex-wrap gap-2"
                           data-testid="categories"
                        >
                           {map(descriptor.categories, (cat) => (
                              <span
                                 key={cat.name}
                                 className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700"
                              >
                                 {cat.name}
                              </span>
                           ))}
                        </div>
                     )}
                  </CardHeader>

                  <CardContent className="p-6">
                     <div data-testid="short-description">
                        <h2 className="mb-3 text-xl font-semibold text-slate-900">
                           Beschreibung
                        </h2>
                        <MDRenderer>{descriptor.description}</MDRenderer>
                     </div>

                     <PromptTextDisplay template={descriptor.promptTemplate} />
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
};
