"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { extractVariablesFromContent } from "@/components/prompts/detail/edit/form/utils";
import { Button } from "@/components/shadcn/button";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from "@/components/shadcn/sheet";
import { MDRenderer } from "@/components/shared/md";
import {
   getPromptVersion,
   getPromptVersions,
   restorePromptVersion,
} from "@/data/actions/prompt";
import {
   DPromptVersion,
   DPromptVersionsPage,
   DPromptVersionSummary,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { useSubscription } from "@/hooks/use-subscription";

import { RestoreVersionDialog } from "./restore-version-dialog";

type Props = {
   prompt: DPromptWithContent;
   globalFields: DGlobalPromptField[];
   initialPage: DPromptVersionsPage;
   initialHasUnversionedChanges: boolean;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

/**
 * Versions-Verlauf-Sheet (feature spec §5.3/§5.4). Shows "Aktuelle Fassung"
 * plus every explicitly created version (newest first), lets the user view a
 * version's content read-only, and drives the restore confirmation flow.
 */
export const VersionHistorySheet = ({
   prompt,
   globalFields,
   initialPage,
   initialHasUnversionedChanges,
   open,
   onOpenChange,
}: Props) => {
   const router = useRouter();
   const { tier } = useSubscription();

   const [versions, setVersions] = useState<DPromptVersionSummary[]>(
      initialPage.content
   );
   const [pageNumber, setPageNumber] = useState(initialPage.pageNumber);
   const [totalElements, setTotalElements] = useState(
      initialPage.totalElements
   );
   const [totalPages, setTotalPages] = useState(initialPage.totalPages);
   const [hasUnversionedChanges] = useState(initialHasUnversionedChanges);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [expandedVersionId, setExpandedVersionId] = useState<string | null>(
      null
   );
   const [viewedVersions, setViewedVersions] = useState<
      Record<string, DPromptVersion>
   >({});
   const [restoringVersion, setRestoringVersion] =
      useState<DPromptVersionSummary | null>(null);
   const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

   const currentFieldNames = useMemo(() => {
      const globalNames = globalFields
         .filter((gf) => prompt.globalFieldIds.includes(gf.id))
         .map((gf) => gf.name);
      return [...prompt.fields.map((f) => f.name), ...globalNames];
   }, [prompt.fields, prompt.globalFieldIds, globalFields]);

   const hasMore = pageNumber + 1 < totalPages;
   const showBasicLimitHint = tier === "BASIC" && totalElements >= 15;

   const fetchVersionContent = async (versionId: string) => {
      if (viewedVersions[versionId]) {
         return;
      }
      const full = await getPromptVersion(prompt.id, versionId);
      if (full) {
         setViewedVersions((prev) => ({ ...prev, [versionId]: full }));
      }
   };

   const handleToggleView = async (version: DPromptVersionSummary) => {
      if (expandedVersionId === version.id) {
         setExpandedVersionId(null);
         return;
      }
      setExpandedVersionId(version.id);
      await fetchVersionContent(version.id);
   };

   const handleLoadMore = async () => {
      setIsLoadingMore(true);
      try {
         const nextPageNumber = pageNumber + 1;
         const result = await getPromptVersions(prompt.id, {
            pagination: {
               pageNumber: nextPageNumber,
               pageSize: initialPage.pageSize,
            },
         });
         if (!result.locked) {
            setVersions((prev) => [...prev, ...result.page.content]);
            setPageNumber(result.page.pageNumber);
            setTotalElements(result.page.totalElements);
            setTotalPages(result.page.totalPages);
         }
      } finally {
         setIsLoadingMore(false);
      }
   };

   const handleRestoreClick = async (version: DPromptVersionSummary) => {
      await fetchVersionContent(version.id);
      setRestoringVersion(version);
      setRestoreDialogOpen(true);
   };

   const handleRestoreConfirm = async (keepCurrentAsVersion: boolean) => {
      if (!restoringVersion) {
         return;
      }

      const result = await restorePromptVersion(
         prompt.id,
         restoringVersion.id,
         keepCurrentAsVersion
      );

      if (result.success) {
         toast.success(result.message);
         setRestoreDialogOpen(false);
         onOpenChange(false);
         router.refresh();
      } else if (result.upgradeRequired) {
         toast.error(result.message, {
            action: {
               label: "Upgrade",
               onClick: () => router.push("/subscription/pricing"),
            },
         });
      } else {
         toast.error(result.message);
      }
   };

   const restoringVersionContent = restoringVersion
      ? viewedVersions[restoringVersion.id]?.content
      : undefined;

   const missingVariables = useMemo(() => {
      if (!restoringVersionContent) {
         return [];
      }
      const detected = extractVariablesFromContent(restoringVersionContent);
      return detected.filter((name) => !currentFieldNames.includes(name));
   }, [restoringVersionContent, currentFieldNames]);

   return (
      <>
         <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
               className="flex w-full flex-col sm:max-w-md"
               data-testid="version-history-sheet"
            >
               <SheetHeader>
                  <SheetTitle>Versionsverlauf</SheetTitle>
               </SheetHeader>
               <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                  <div
                     className="space-y-1 rounded-lg border p-3"
                     data-testid="current-version-entry"
                  >
                     <p className="text-sm font-medium">● Aktuelle Fassung</p>
                     {hasUnversionedChanges && versions[0] && (
                        <p
                           className="text-xs text-muted-foreground"
                           data-testid="unversioned-changes-hint"
                        >
                           Seit Version {versions[0].versionNumber} wurden
                           Änderungen gespeichert, die nicht als eigene Version
                           markiert sind.
                        </p>
                     )}
                  </div>

                  {versions.length === 0 && (
                     <p
                        className="text-sm text-muted-foreground"
                        data-testid="no-versions-hint"
                     >
                        Noch keine Versionen vorhanden.
                     </p>
                  )}

                  {versions.map((version) => {
                     const isExpanded = expandedVersionId === version.id;
                     const viewed = viewedVersions[version.id];

                     return (
                        <div
                           key={version.id}
                           className="space-y-2 rounded-lg border p-3"
                           data-testid="version-entry"
                        >
                           <p className="text-sm font-medium">
                              Version {version.versionNumber} ·{" "}
                              {formatDistanceToNow(
                                 new Date(version.createdAt),
                                 { addSuffix: true, locale: de }
                              )}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              {version.note || "(keine Notiz)"}
                           </p>
                           <div className="flex gap-2">
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleToggleView(version)}
                                 className="cursor-pointer"
                                 data-testid="view-version-btn"
                              >
                                 Ansehen
                              </Button>
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleRestoreClick(version)}
                                 className="cursor-pointer"
                                 data-testid="restore-version-btn"
                              >
                                 Wiederherstellen
                              </Button>
                           </div>
                           {isExpanded && (
                              <div
                                 className="rounded-md bg-slate-100 p-3"
                                 data-testid="version-content"
                              >
                                 {viewed ? (
                                    <MDRenderer className="font-mono text-sm">
                                       {viewed.content}
                                    </MDRenderer>
                                 ) : (
                                    <Loader
                                       className="h-4 w-4 animate-spin"
                                       data-testid="version-content-loading"
                                    />
                                 )}
                              </div>
                           )}
                        </div>
                     );
                  })}

                  {hasMore && (
                     <Button
                        type="button"
                        variant="ghost"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="w-full cursor-pointer"
                        data-testid="load-more-btn"
                     >
                        {isLoadingMore ? "Wird geladen..." : "Weitere laden"}
                     </Button>
                  )}

                  {showBasicLimitHint && (
                     <p
                        className="text-xs text-muted-foreground"
                        data-testid="basic-limit-hint"
                     >
                        Es werden nur die letzten 20 Versionen aufbewahrt.
                        Upgrade auf PRO für unbegrenzte Historie.
                     </p>
                  )}
               </div>
            </SheetContent>
         </Sheet>

         {restoringVersion && (
            <RestoreVersionDialog
               version={restoringVersion}
               missingVariables={missingVariables}
               open={restoreDialogOpen}
               onOpenChange={setRestoreDialogOpen}
               onConfirm={handleRestoreConfirm}
            />
         )}
      </>
   );
};
