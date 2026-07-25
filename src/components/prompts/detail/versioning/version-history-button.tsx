"use client";

import { useState } from "react";
import { History, Zap } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { DPromptVersionsResult, DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";

import { VersionHistorySheet } from "./version-history-sheet";

type Props = {
   prompt: DPromptWithContent;
   versionsResult: DPromptVersionsResult;
   globalFields: DGlobalPromptField[];
};

/**
 * Sidebar entry point for the version history feature (see feature spec §5.2).
 * Stays visible for FREE users (discoverability), but opens an upgrade prompt
 * instead of the version history sheet.
 */
export const VersionHistoryButton = ({
   prompt,
   versionsResult,
   globalFields,
}: Props) => {
   const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
   const [sheetOpen, setSheetOpen] = useState(false);

   const totalVersions = versionsResult.locked
      ? 0
      : versionsResult.page.totalElements;

   const handleClick = () => {
      if (versionsResult.locked) {
         setUpgradeDialogOpen(true);
      } else {
         setSheetOpen(true);
      }
   };

   return (
      <>
         <Button
            variant="outline"
            onClick={handleClick}
            className="w-full cursor-pointer justify-start"
            data-testid="version-history-btn"
         >
            <History className="mr-2 h-4 w-4" />
            Versionsverlauf
            {totalVersions > 0 && (
               <Badge
                  variant="secondary"
                  className="ml-auto"
                  data-testid="version-history-badge"
               >
                  {totalVersions}
               </Badge>
            )}
         </Button>

         <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
            <DialogContent
               className="max-w-sm"
               data-testid="version-history-upgrade-dialog"
            >
               <div className="flex flex-col items-center gap-4 pt-2 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 ring-4 ring-amber-50">
                     <Zap className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="space-y-1.5">
                     <DialogTitle className="text-xl font-bold">
                        Versionsverlauf ist ab BASIC verfügbar
                     </DialogTitle>
                     <DialogDescription>
                        Speichere bewusste Checkpoints deines Prompt-Texts und
                        kehre jederzeit zu einer früheren Fassung zurück.
                     </DialogDescription>
                  </div>
               </div>
               <div className="flex flex-col gap-2 pt-2">
                  <Button
                     asChild
                     size="lg"
                     className="w-full gap-2 font-semibold"
                  >
                     <Link
                        href="/subscription/pricing"
                        data-testid="upgrade-btn"
                     >
                        <Zap className="h-4 w-4" />
                        Jetzt upgraden
                     </Link>
                  </Button>
                  <Button
                     variant="ghost"
                     className="w-full cursor-pointer text-muted-foreground"
                     onClick={() => setUpgradeDialogOpen(false)}
                     data-testid="cancel-btn"
                  >
                     Vielleicht später
                  </Button>
               </div>
            </DialogContent>
         </Dialog>

         {!versionsResult.locked && (
            <VersionHistorySheet
               prompt={prompt}
               globalFields={globalFields}
               initialPage={versionsResult.page}
               initialHasUnversionedChanges={
                  versionsResult.hasUnversionedChanges
               }
               open={sheetOpen}
               onOpenChange={setSheetOpen}
            />
         )}
      </>
   );
};
