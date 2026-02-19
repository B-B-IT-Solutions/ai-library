"use client";

import { FC } from "react";
import { Grid3x3, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { DListViewMode } from "@/data/types/domain/common";
import { cn } from "@/lib/utils";

type ViewToggleProps = {
   currentView: DListViewMode;
};

export const ViewToggle: FC<ViewToggleProps> = ({ currentView }) => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   const updateViewMode = (viewMode: DListViewMode) => {
      const params = new URLSearchParams(searchParams);
      params.set("view", viewMode);
      replace(`${pathname}?${params.toString()}`);
   };

   return (
      <div
         className="flex items-center rounded-md border"
         data-testid="view-toggle"
      >
         <Button
            variant="ghost"
            size="sm"
            onClick={() => updateViewMode("grid")}
            className={cn(
               "h-8 cursor-pointer rounded-r-none border-r px-3",
               currentView === "grid" && "bg-slate-100"
            )}
            data-testid="grid-view-btn"
         >
            <Grid3x3 className="h-4 w-4" />
         </Button>
         <Button
            variant="ghost"
            size="sm"
            onClick={() => updateViewMode("list")}
            className={cn(
               "h-8 cursor-pointer rounded-l-none px-3",
               currentView === "list" && "bg-slate-100"
            )}
            data-testid="list-view-btn"
         >
            <List className="h-4 w-4" />
         </Button>
      </div>
   );
};
