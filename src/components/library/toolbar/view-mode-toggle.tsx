"use client";

import { Grid3x3, List } from "lucide-react";
import { FC } from "react";

import { LibraryViewMode } from "@/data/types/domain/library";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";

type ViewModeToggleProps = {
   value: LibraryViewMode;
   onChange: (mode: LibraryViewMode) => void;
};

export const ViewModeToggle: FC<ViewModeToggleProps> = ({ value, onChange }) => {
   return (
      <div className="flex items-center border rounded-md">
         <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("grid")}
            className={cn(
               "rounded-r-none border-r h-8 px-3",
               value === "grid" && "bg-slate-100"
            )}
         >
            <Grid3x3 className="h-4 w-4" />
         </Button>
         <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("list")}
            className={cn("rounded-l-none h-8 px-3", value === "list" && "bg-slate-100")}
         >
            <List className="h-4 w-4" />
         </Button>
      </div>
   );
};
