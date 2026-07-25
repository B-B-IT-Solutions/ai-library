"use client";

import { useRef } from "react";
import { ChevronDown, History, Loader, Lock } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { cn } from "@/lib/utils";

type Props = {
   formId: string;
   isEdit: boolean;
   isSubmitting: boolean;
   /**
    * Whether the current user's plan allows creating a version snapshot
    * (`canAccessVersionHistory` tier feature). FREE users still see the
    * chevron/menu item — it's just disabled — so the feature stays
    * discoverable as an upgrade incentive (see feature spec §5.1/§3.4).
    */
   canAccessVersionHistory: boolean;
};

/**
 * Split-button used for the prompt editor's "Speichern" action. The primary
 * (left) segment behaves exactly like the previous plain submit button and
 * never creates a version. The chevron (right) segment opens a dropdown with
 * a single option, "Speichern als neue Version", which submits the very same
 * form via a second, visually hidden submit button — `prompt-form.tsx`
 * distinguishes the two based on `event.nativeEvent.submitter` (name/value
 * "intent"="normal"|"version").
 */
export const PromptSaveSplitButton = ({
   formId,
   isEdit,
   isSubmitting,
   canAccessVersionHistory,
}: Props) => {
   const versionSubmitRef = useRef<HTMLButtonElement>(null);

   const handleSaveAsVersionSelect = () => {
      versionSubmitRef.current?.click();
   };

   const label = isEdit ? "Prompt speichern" : "Prompt erstellen";
   const loadingLabel = isEdit ? "Wird gespeichert..." : "Wird erstellt...";

   const primaryButton = (
      <Button
         type="submit"
         form={formId}
         name="intent"
         value="normal"
         disabled={isSubmitting}
         className={cn(
            "cursor-pointer bg-blue-700 hover:bg-blue-800",
            isEdit && "rounded-r-none"
         )}
         data-testid="save-btn"
      >
         {isSubmitting ? (
            <>
               <Loader className="h-4 w-4 animate-spin" />
               {loadingLabel}
            </>
         ) : (
            <>{label}</>
         )}
      </Button>
   );

   if (!isEdit) {
      return primaryButton;
   }

   return (
      <div className="flex items-stretch" data-testid="save-split-btn">
         {primaryButton}
         {/* Not user-facing: clicked programmatically to submit with intent=version */}
         <button
            type="submit"
            form={formId}
            name="intent"
            value="version"
            ref={versionSubmitRef}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            data-testid="save-as-version-submit"
         />
         <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
               <Button
                  type="button"
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-l-none border-l border-blue-800 bg-blue-700 px-2 hover:bg-blue-800"
                  aria-label="Weitere Speicheroptionen"
                  data-testid="save-split-btn-trigger"
               >
                  <ChevronDown className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               {canAccessVersionHistory ? (
                  <DropdownMenuItem
                     onSelect={handleSaveAsVersionSelect}
                     className="cursor-pointer"
                     data-testid="save-as-version-menu-item"
                  >
                     <History className="mr-2 h-4 w-4" />
                     <div className="flex flex-col">
                        <span>Speichern als neue Version</span>
                        <span className="text-xs text-muted-foreground">
                           Sichert deinen aktuellen Stand in der
                           Versionshistorie, bevor deine Änderung gespeichert
                           wird.
                        </span>
                     </div>
                  </DropdownMenuItem>
               ) : (
                  <Tooltip>
                     <TooltipTrigger asChild={true}>
                        {/* Radix sets pointer-events:none on disabled items, so the
                            tooltip trigger needs to sit on a wrapping element that
                            keeps its own pointer-events enabled. */}
                        <span className="block" tabIndex={0}>
                           <DropdownMenuItem
                              disabled={true}
                              className="cursor-not-allowed opacity-50"
                              data-testid="save-as-version-menu-item"
                           >
                              <Lock className="mr-2 h-4 w-4" />
                              Speichern als neue Version
                           </DropdownMenuItem>
                        </span>
                     </TooltipTrigger>
                     <TooltipContent>Ab BASIC verfügbar</TooltipContent>
                  </Tooltip>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};
