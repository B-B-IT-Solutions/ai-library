"use client";

import { FC, useState } from "react";
import { map } from "es-toolkit/compat";
import { ChevronDown, ChevronUp, Folder, Sparkles } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DBundleItem } from "@/data/types/domain/product";
import type { BundleItemGroup } from "../product-details-dialog/types";

interface BundleItemsProps {
   items: DBundleItem[];
   groupByCategory?: boolean;
}

export const BundleItems: FC<BundleItemsProps> = ({
   items,
   groupByCategory = true,
}) => {
   const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

   const toggleItem = (itemId: string) => {
      setExpandedItems((prev) => {
         const next = new Set(prev);
         if (next.has(itemId)) {
            next.delete(itemId);
         } else {
            next.add(itemId);
         }
         return next;
      });
   };

   // Group items by category
   const groupedItems = (): BundleItemGroup[] => {
      if (!groupByCategory) {
         return [
            {
               category: "All Templates",
               items,
            },
         ];
      }

      const groups: Record<string, DBundleItem[]> = {};

      items.forEach((item) => {
         const categories = item.template?.categories || [];
         if (categories.length === 0) {
            const key = "Other";
            if (!groups[key]) {
               groups[key] = [];
            }
            groups[key].push(item);
         } else {
            categories.forEach((cat) => {
               const key = cat.name;
               if (!groups[key]) {
                  groups[key] = [];
               }
               groups[key].push(item);
            });
         }
      });

      return Object.entries(groups).map(([category, items]) => ({
         category,
         items,
      }));
   };

   const groups = groupedItems();

   return (
      <section className="space-y-3">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Folder className="h-5 w-5 text-indigo-600" />
            Included Templates ({items.length})
         </h3>

         <div className="space-y-4">
            {groups.map((group, groupIndex) => (
               <div key={groupIndex}>
                  {groupByCategory && (
                     <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
                        <Badge variant="outline">{group.category}</Badge>
                        <span className="text-xs text-slate-500">
                           {group.items.length} template
                           {group.items.length > 1 ? "s" : ""}
                        </span>
                     </h4>
                  )}

                  <div className="space-y-2">
                     {map(group.items, (item) => {
                        const isExpanded = expandedItems.has(item.id);

                        return (
                           <div
                              key={item.id}
                              className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden"
                           >
                              <button
                                 onClick={() => toggleItem(item.id)}
                                 className="w-full flex items-center justify-between p-3 hover:bg-slate-100 transition-colors"
                              >
                                 <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <h5 className="font-medium text-slate-900 text-sm truncate">
                                       {item?.template?.title}
                                    </h5>
                                    {item?.template?.recommendedModel && (
                                       <Badge
                                          variant="secondary"
                                          className="text-xs shrink-0"
                                       >
                                          <Sparkles className="h-3 w-3 mr-1" />
                                          {item.template.recommendedModel}
                                       </Badge>
                                    )}
                                 </div>
                                 {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-slate-600 shrink-0" />
                                 ) : (
                                    <ChevronDown className="h-4 w-4 text-slate-600 shrink-0" />
                                 )}
                              </button>

                              {isExpanded && item?.template?.content && (
                                 <div className="px-3 pb-3 space-y-2">
                                    <div className="bg-white border border-slate-200 rounded p-3">
                                       <p className="text-xs text-slate-700 whitespace-pre-wrap line-clamp-4">
                                          {item.template.content}
                                       </p>
                                    </div>
                                    {item?.template?.categories &&
                                       item.template.categories.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                             {map(
                                                item.template.categories,
                                                (cat) => (
                                                   <span
                                                      key={cat.name}
                                                      className="text-xs px-2 py-0.5 bg-white text-slate-600 rounded border border-slate-200"
                                                   >
                                                      {cat.name}
                                                   </span>
                                                )
                                             )}
                                          </div>
                                       )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
};
