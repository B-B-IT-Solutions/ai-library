"use client";

import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
   onClick: () => void;
   title: string;
   icon: ReactNode;
   isActive?: boolean;
};

export const ToolbarButton: FC<ToolbarButtonProps> = ({
   onClick,
   title,
   icon,
   isActive,
}) => (
   <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
         "p-2 rounded hover:bg-slate-100 transition-colors",
         isActive ? "bg-slate-200 text-blue-600" : "text-slate-700"
      )}
   >
      {icon}
   </button>
);
