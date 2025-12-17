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
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
         <Button
            variant={currentView === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => updateViewMode("grid")}
            className="gap-2 cursor-pointer"
            data-testid="grid-view-button"
         >
            <Grid3x3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
         </Button>
         <Button
            variant={currentView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => updateViewMode("list")}
            className="gap-2 cursor-pointer"
            data-testid="list-view-button"
         >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
         </Button>
      </div>
   );
};
