"use client";

import { useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import { DPromptVersionSummary } from "@/data/types/domain/prompt";

type Props = {
   version: DPromptVersionSummary;
   /** Placeholders present in the version's content but not in the current fields (V-7). */
   missingVariables: string[];
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: (keepCurrentAsVersion: boolean) => Promise<void> | void;
};

export const RestoreVersionDialog = ({
   version,
   missingVariables,
   open,
   onOpenChange,
   onConfirm,
}: Props) => {
   // Checked by default — the only place in this feature where a versioning
   // option is pre-selected, because this is the only spot where real,
   // irreversible data loss is possible (see feature spec §5.4).
   const [keepCurrentAsVersion, setKeepCurrentAsVersion] = useState(true);
   const [isRestoring, setIsRestoring] = useState(false);

   const handleConfirm = async () => {
      setIsRestoring(true);
      try {
         await onConfirm(keepCurrentAsVersion);
      } finally {
         setIsRestoring(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            className="max-w-md"
            data-testid="restore-version-dialog"
         >
            <DialogHeader>
               <DialogTitle>
                  Version {version.versionNumber} wiederherstellen?
               </DialogTitle>
               <DialogDescription>
                  Der aktuelle Prompt-Text wird durch den Inhalt dieser Version
                  ersetzt.
               </DialogDescription>
            </DialogHeader>

            {missingVariables.length > 0 && (
               <div
                  className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
                  data-testid="variable-mismatch-warning"
               >
                  <AlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5" />
                  <p>
                     Diese Version enthält Platzhalter, die aktuell nicht als
                     Felder definiert sind:{" "}
                     <span className="font-medium">
                        {missingVariables
                           .map((name) => `{{${name}}}`)
                           .join(", ")}
                     </span>
                     . Diese werden nach dem Wiederherstellen im
                     „Platzhalter“-Tab als neu erkannt angezeigt.
                  </p>
               </div>
            )}

            <div className="flex items-start gap-3 rounded-lg border p-3">
               <Checkbox
                  id="keep-current-as-version"
                  checked={keepCurrentAsVersion}
                  onCheckedChange={(checked) =>
                     setKeepCurrentAsVersion(checked === true)
                  }
                  data-testid="keep-current-as-version-checkbox"
               />
               <Label
                  htmlFor="keep-current-as-version"
                  className="flex flex-col items-start gap-1 font-normal"
               >
                  <span>Aktuelle Fassung vorher als neue Version sichern</span>
                  <span className="text-xs font-normal text-muted-foreground">
                     Empfohlen — sonst gehen seit der letzten Version
                     gespeicherte, unversionierte Änderungen unwiderruflich
                     verloren.
                  </span>
               </Label>
            </div>

            <DialogFooter>
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isRestoring}
                  className="cursor-pointer"
                  data-testid="cancel-btn"
               >
                  Abbrechen
               </Button>
               <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isRestoring}
                  className="cursor-pointer bg-blue-700 hover:bg-blue-800"
                  data-testid="confirm-restore-btn"
               >
                  {isRestoring ? (
                     <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Wird wiederhergestellt...
                     </>
                  ) : (
                     "Wiederherstellen"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
