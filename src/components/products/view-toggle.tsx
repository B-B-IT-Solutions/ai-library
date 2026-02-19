"use client";

import { FC } from "react";
import { Grid3x3, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { DListViewMode } from "@/data/types/domain/common";

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
         className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
         data-testid="view-toggle"
      >
         <Button
            variant={currentView === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => updateViewMode("grid")}
            className="cursor-pointer gap-2"
            data-testid="grid-view-btn"
         >
            <Grid3x3 className="h-4 w-4" />
            <span className="hidden sm:inline">Raster</span>
         </Button>
         <Button
            variant={currentView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => updateViewMode("list")}
            className="cursor-pointer gap-2"
            data-testid="list-view-btn"
         >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Liste</span>
         </Button>
      </div>
   );
};
