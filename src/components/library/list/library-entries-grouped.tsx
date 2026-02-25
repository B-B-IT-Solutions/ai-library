"use client";

import { FC, useMemo } from "react";
import { groupBy as lodashGroupBy, map } from "es-toolkit/compat";

import { DListGroupByMode } from "@/data/types/domain/common";
import { DLibraryCollection, DLibraryEntry } from "@/data/types/domain/library";
import { LibraryEntryCard } from "../list-item/library-entry-card";

type GroupedEntries = {
   key: string;
   label: string;
   count: number;
   entries: DLibraryEntry[];
};

type LibraryEntriesGroupedProps = {
   entries: DLibraryEntry[];
   collections: DLibraryCollection[];
   groupBy: DListGroupByMode;
};

export const LibraryEntriesGrouped: FC<LibraryEntriesGroupedProps> = ({
   entries,
   collections,
   groupBy,
}) => {
   const grouped = useMemo(() => {
      switch (groupBy) {
         case "category":
            return groupByCategories(entries);
         case "model":
            return groupByModels(entries);
         case "date":
            return groupByDate(entries);
         default:
            return [];
      }
   }, [entries, groupBy]);

   if (entries.length === 0) {
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
      <div className="space-y-8">
         {map(grouped, (group) => (
            <div key={group.key}>
               <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  {group.label} ({group.count})
               </h3>
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {map(group.entries, (entry) => (
                     <LibraryEntryCard
                        key={entry.id}
                        entry={entry}
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

function groupByCategories(entries: DLibraryEntry[]): GroupedEntries[] {
   const grouped = lodashGroupBy(entries, (entry) => {
      const firstCategory = entry.templateDescriptor.categories[0];
      return firstCategory?.name || "Uncategorized";
   });

   return map(Object.entries(grouped), ([key, items]) => ({
      key,
      label: key,
      count: items.length,
      entries: items,
   }));
}

function groupByModels(entries: DLibraryEntry[]): GroupedEntries[] {
   const grouped = lodashGroupBy(
      entries,
      (entry) => entry.templateDescriptor.recommendedModel
   );

   return map(Object.entries(grouped), ([key, items]) => ({
      key,
      label: key,
      count: items.length,
      entries: items,
   }));
}

function groupByDate(entries: DLibraryEntry[]): GroupedEntries[] {
   const now = new Date();
   const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
   const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

   const thisWeek: DLibraryEntry[] = [];
   const thisMonth: DLibraryEntry[] = [];
   const older: Record<string, DLibraryEntry[]> = {};

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

   const result: GroupedEntries[] = [];

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
