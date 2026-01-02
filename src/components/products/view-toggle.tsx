"use client";

import { FC } from "react";
import { Grid3x3, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { DProductViewMode } from "@/data/types/domain/product";

type ViewToggleProps = {
   currentView: DProductViewMode;
};

export const ViewToggle: FC<ViewToggleProps> = ({ currentView }) => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   const updateViewMode = (viewMode: DProductViewMode) => {
      const params = new URLSearchParams(searchParams);
      params.set("view", viewMode);
      replace(`${pathname}?${params.toString()}`);
   };

   return (
      <div
         className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg"
         data-testid="view-toggle"
      >
         <Button
            variant={currentView === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => updateViewMode("grid")}
            className="gap-2 cursor-pointer"
            data-testid="grid-view-btn"
         >
            <Grid3x3 className="w-4 h-4" />
            <span className="hidden sm:inline">Raster</span>
         </Button>
         <Button
            variant={currentView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => updateViewMode("list")}
            className="gap-2 cursor-pointer"
            data-testid="list-view-btn"
         >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Liste</span>
         </Button>
      </div>
   );
};
