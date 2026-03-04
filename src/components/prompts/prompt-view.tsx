"use client";

import { FC, ReactNode } from "react";
import { isEmpty } from "es-toolkit/compat";
import { Clock, FileText, Plus, Sparkles, Star } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useInfiniteLoadPrompts } from "@/data/ts-queries/prompt";
import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

const PromptCard: FC<{ prompt: DPromptDescriptor }> = ({ prompt }) => {
   return (
      <Link href={`/prompts/${prompt.id}`}>
         <Card className="group h-full cursor-pointer gap-0 border border-slate-200 bg-white p-0 transition-all duration-200 hover:border-blue-200 hover:shadow-md">
            <CardContent className="flex h-full flex-col p-4">
               <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 flex-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                     {prompt.title}
                  </h3>
                  {prompt.isFavorite && (
                     <Star className="h-4 w-4 flex-shrink-0 fill-yellow-400 text-yellow-500" />
                  )}
               </div>
               {!isEmpty(prompt.categories) && (
                  <div className="mb-3 flex flex-wrap gap-1">
                     {prompt.categories.slice(0, 2).map((cat, idx) => (
                        <span
                           key={idx}
                           className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
                        >
                           {cat.name}
                        </span>
                     ))}
                     {prompt.categories.length > 2 && (
                        <span className="text-xs text-slate-400">
                           +{prompt.categories.length - 2}
                        </span>
                     )}
                  </div>
               )}
               <div className="mt-auto flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatDateTime(prompt.updatedAt).dateOnly}</span>
               </div>
            </CardContent>
         </Card>
      </Link>
   );
};

const PromptCardSkeleton: FC = () => (
   <Card className="gap-0 border border-slate-200 bg-white p-0">
      <CardContent className="p-4">
         <Skeleton className="mb-2 h-4 w-3/4" />
         <Skeleton className="mb-3 h-4 w-1/2" />
         <div className="flex gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
         </div>
      </CardContent>
   </Card>
);

const StatCard: FC<{
   icon: ReactNode;
   label: string;
   value: number;
}> = ({ icon, label, value }) => (
   <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
         {icon}
      </div>
      <div>
         <p className="text-xs text-slate-500">{label}</p>
         <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
   </div>
);

export const PromptView: FC = () => {
   const {
      data: { pages = [] } = {},
      isLoading,
   } = useInfiniteLoadPrompts({});

   const allPrompts = pages.flatMap((page) => page.content);
   const totalCount = pages[0]?.totalElements ?? 0;
   const favoritePrompts = allPrompts.filter((p) => p.isFavorite);
   const recentPrompts = allPrompts.slice(0, 6);
   const hasPrompts = allPrompts.length > 0;

   if (!isLoading && !hasPrompts) {
      return (
         <div
            className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center"
            data-testid="prompt-view"
         >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
               <Sparkles className="h-10 w-10 text-blue-500" />
            </div>
            <div className="max-w-sm">
               <h2 className="text-xl font-bold text-slate-900">
                  Noch keine Prompts
               </h2>
               <p className="mt-2 text-sm text-slate-500">
                  Erstellen Sie Ihren ersten Prompt und bauen Sie Ihre
                  persönliche KI-Bibliothek auf.
               </p>
            </div>
            <Button
               asChild={true}
               className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
               data-testid="create-prompt-btn"
            >
               <Link href="/prompts/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ersten Prompt erstellen
               </Link>
            </Button>
         </div>
      );
   }

   return (
      <div className="space-y-6" data-testid="prompt-view">
         <div className="flex items-start justify-between">
            <div>
               <h2 className="text-xl font-bold text-slate-900">Übersicht</h2>
               <p className="mt-0.5 text-sm text-slate-500">
                  Wählen Sie einen Prompt aus der Liste oder erstellen Sie einen
                  neuen.
               </p>
            </div>
            <Button
               asChild={true}
               size="sm"
               className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
               data-testid="create-prompt-btn"
            >
               <Link href="/prompts/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Neuer Prompt
               </Link>
            </Button>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <StatCard
               icon={<FileText className="h-5 w-5" />}
               label="Gesamt"
               value={isLoading ? 0 : totalCount}
            />
            <StatCard
               icon={<Star className="h-5 w-5" />}
               label="Favoriten"
               value={isLoading ? 0 : favoritePrompts.length}
            />
         </div>

         <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">
               Zuletzt bearbeitet
            </h3>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
               {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                       <PromptCardSkeleton key={i} />
                    ))
                  : recentPrompts.map((prompt) => (
                       <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
            </div>
         </div>

         {!isLoading && favoritePrompts.length > 0 && (
            <div className="space-y-3">
               <h3 className="text-sm font-semibold text-slate-700">
                  Favoriten
               </h3>
               <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {favoritePrompts.slice(0, 3).map((prompt) => (
                     <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};
