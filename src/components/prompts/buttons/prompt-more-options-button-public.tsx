"use client";

import { useState } from "react";
import { Eye, MoreVertical } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DPrompt } from "@/data/types/domain/prompt";

import { DownloadPromptButton } from "./download-prompt-button";

type Props = {
   prompt: DPrompt;
   collectionToken?: string | null;
};

export const PublicPromptMoreOptionsButton = ({
   prompt,
   collectionToken,
}: Props) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const templateDetailsUrl = collectionToken
      ? `/preview/templates/${prompt.id}?col=${collectionToken}`
      : `/preview/templates/${prompt.id}`;

   const handleContextMenuOpen = (open: boolean) => {
      if (open) {
         setIsMenuOpen(true);
      } else {
         setTimeout(() => setIsMenuOpen(false), 200);
      }
   };

   return (
      <DropdownMenu
         data-testid="public-prompt-more-options-btn"
         onOpenChange={handleContextMenuOpen}
      >
         <DropdownMenuTrigger asChild={true}>
            <Button
               variant="outline"
               size="sm"
               className="cursor-pointer"
               aria-label="Weitere Optionen"
               title="Weitere Optionen"
               data-state={isMenuOpen && "open"}
               data-testid="more-options-trigger-btn"
            >
               <MoreVertical className="h-4 w-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem
               asChild={true}
               className="cursor-pointer hover:bg-accent"
               data-testid="view-prompt-menu-item"
            >
               <Link href={templateDetailsUrl}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ansehen
               </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DownloadPromptButton prompt={prompt} asMenuItem={true} />
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
