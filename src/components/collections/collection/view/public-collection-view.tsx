import { Folder, Globe } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { TemplateItems } from "@/components/templates/lists";
import { DCollection } from "@/data/types/domain/collection";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type Props = {
   collection: DCollection;
};

export const PublicCollectionView = async ({ collection }: Props) => {
   const templates: DPromptTemplateDescriptor[] = [];
   const iconColor = collection.color;

   return (
      <div className="min-h-full bg-slate-50">
         {/* Collection Header */}
         <div
            className="border-b bg-white px-6 py-8"
            data-testid="collection-public-view"
         >
            <div className="mx-auto max-w-5xl">
               <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${iconColor}20` }}
                     >
                        <Folder
                           className="h-6 w-6"
                           style={{ color: iconColor }}
                        />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <h1 className="text-2xl font-bold text-slate-900">
                              {collection.name}
                           </h1>
                           <Globe className="h-4 w-4 text-green-600" />
                        </div>
                        {collection.description && (
                           <p className="mt-1 text-slate-500">
                              {collection.description}
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto px-8 py-6">
            <TemplateItems
               viewMode={DListViewMode.GRID}
               groupBy={DListGroupByMode.NONE}
               sortBy={DListSortByMode.DATE_ASC}
               filters={{}}
            />
         </div>
         {/* Templates */}
         <div className="mx-auto max-w-5xl px-6 py-8">
            {templates.length === 0 ? (
               <div className="py-16 text-center">
                  <Folder className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">
                     Diese Sammlung enthält keine Vorlagen.
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => (
                     <div
                        key={template.id}
                        className="rounded-xl border bg-white p-5 shadow-sm"
                        data-testid="public-template-card"
                     >
                        <h3 className="mb-1 line-clamp-2 font-semibold text-slate-900">
                           {template.title}
                        </h3>
                        {template.description && (
                           <p className="mb-3 line-clamp-3 text-sm text-slate-500">
                              {template.description}
                           </p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                           {template.recommendedModel && (
                              <Badge variant="secondary" className="text-xs">
                                 {template.recommendedModel}
                              </Badge>
                           )}
                           {template.categories.slice(0, 2).map((cat) => (
                              <Badge
                                 key={cat.name}
                                 variant="outline"
                                 className="text-xs"
                              >
                                 {cat.name}
                              </Badge>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};
