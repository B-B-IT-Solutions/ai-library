"use client";

import { useMemo } from "react";
import { groupBy as lodashGroupBy, map } from "es-toolkit/compat";

import { DListGroupByMode } from "@/data/types/domain/common";
import { DLibraryCollection } from "@/data/types/domain/library";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { LibraryEntryCard } from "./items/library-entry-card";

type GroupedTemplates = {
   key: string;
   label: string;
   count: number;
   entries: DPromptTemplateDescriptor[];
};

type Props = {
   descriptors: DPromptTemplateDescriptor[];
   collections: DLibraryCollection[];
   groupBy: DListGroupByMode;
};

export const TemplateItemsGrouped = ({
   descriptors,
   collections,
   groupBy,
}: Props) => {
   const grouped = useMemo(() => {
      switch (groupBy) {
         case "category":
            return groupByCategories(descriptors);
         case "model":
            return groupByModels(descriptors);
         case "date":
            return groupByDate(descriptors);
         default:
            return [];
      }
   }, [descriptors, groupBy]);

   if (descriptors.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-slate-600">
               Keine Vorlagen gefunden
            </p>
            <p className="mt-2 text-sm text-slate-500">
               Versuchen Sie, Ihre Filterkriterien anzupassen
            </p>
         </div>
      );
   }

   return (
      <div className="space-y-8" data-testid="library-entries-groups">
         {map(grouped, (group) => (
            <div key={group.key}>
               <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  {group.label} ({group.count})
               </h3>
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {map(group.entries, (entry) => (
                     <LibraryEntryCard
                        key={entry.id}
                        descriptor={entry}
                        collections={collections}
                     />
                  ))}
               </div>
            </div>
         ))}
      </div>
   );
};

// Helper functions

function groupByCategories(
   descriptors: DPromptTemplateDescriptor[]
): GroupedTemplates[] {
   const grouped = lodashGroupBy(descriptors, (descriptor) => {
      const firstCategory = descriptor.categories[0];
      return firstCategory?.name || "Uncategorized";
   });

   return map(Object.entries(grouped), ([key, items]) => ({
      key,
      label: key,
      count: items.length,
      entries: items,
   }));
}

function groupByModels(
   descriptors: DPromptTemplateDescriptor[]
): GroupedTemplates[] {
   const grouped = lodashGroupBy(
      descriptors,
      (descriptor) => descriptor.recommendedModel
   );

   return map(Object.entries(grouped), ([key, items]) => ({
      key,
      label: key,
      count: items.length,
      entries: items,
   }));
}

function groupByDate(entries: DPromptTemplateDescriptor[]): GroupedTemplates[] {
   const now = new Date();
   const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
   const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

   const thisWeek: DPromptTemplateDescriptor[] = [];
   const thisMonth: DPromptTemplateDescriptor[] = [];
   const older: Record<string, DPromptTemplateDescriptor[]> = {};

   entries.forEach((entry) => {
      const createdAt = new Date(entry.createdAt);

      if (createdAt >= oneWeekAgo) {
         thisWeek.push(entry);
      } else if (createdAt >= oneMonthAgo) {
         thisMonth.push(entry);
      } else {
         const monthYear = createdAt.toLocaleDateString("de-DE", {
            year: "numeric",
            month: "long",
         });
         if (!older[monthYear]) {
            older[monthYear] = [];
         }
         older[monthYear].push(entry);
      }
   });

   const result: GroupedTemplates[] = [];

   if (thisWeek.length > 0) {
      result.push({
         key: "this-week",
         label: "Diese Woche",
         count: thisWeek.length,
         entries: thisWeek,
      });
   }

   if (thisMonth.length > 0) {
      result.push({
         key: "this-month",
         label: "Diesen Monat",
         count: thisMonth.length,
         entries: thisMonth,
      });
   }

   Object.entries(older).forEach(([monthYear, items]) => {
      result.push({
         key: monthYear,
         label: monthYear,
         count: items.length,
         entries: items,
      });
   });

   return result;
}
