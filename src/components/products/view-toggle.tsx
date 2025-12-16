"use client";

import { FC } from "react";
import { Grid3x3, List } from "lucide-react";

import { Button } from "@/components/shadcn/button";

type ViewMode = "grid" | "list";

type ViewToggleProps = {
   currentView: ViewMode;
   onViewChange: (view: ViewMode) => void;
};

export const ViewToggle: FC<ViewToggleProps> = ({
   currentView,
   onViewChange,
}) => {
   return (
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
         <Button
            variant={currentView === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("grid")}
            className="gap-2"
            data-testid="grid-view-button"
         >
            <Grid3x3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
         </Button>
         <Button
            variant={currentView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("list")}
            className="gap-2"
            data-testid="list-view-button"
         >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
         </Button>
      </div>
   );
};

export type { ViewMode };
