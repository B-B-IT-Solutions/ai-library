"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Control } from "react-hook-form";

import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { FormMDEditor } from "@/components/shared/widgets";
import { DPromptUpdate } from "@/data/types/domain/prompt";

const VERSION_NOTE_MAX_LENGTH = 500;

type Props = {
   control: Control<DPromptUpdate>;
   isEdit: boolean;
   versionNote: string;
   onVersionNoteChange: (note: string) => void;
};

export const PromptText = ({
   control,
   isEdit,
   versionNote,
   onVersionNoteChange,
}: Props) => {
   const [showNoteField, setShowNoteField] = useState(false);

   return (
      <section className="space-y-4" data-testid="prompt-text">
         <p className="text-sm text-slate-500">
            Verwenden Sie{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">
               {`{{feld_name}}`}
            </code>{" "}
            für Platzhalter, die durch Ihre Felder ersetzt werden
         </p>
         <FormMDEditor<DPromptUpdate>
            name="content"
            placeholder="Du bist ein erfahrener {{rolle}}. Erstelle einen {{format}} über {{thema}} für {{zielgruppe}}."
            control={control}
         />
         {isEdit && (
            <div data-testid="version-note-section">
               {showNoteField ? (
                  <div className="space-y-1.5">
                     <Label htmlFor="version-note">
                        Notiz zur Version (optional)
                     </Label>
                     <Textarea
                        id="version-note"
                        value={versionNote}
                        onChange={(e) => onVersionNoteChange(e.target.value)}
                        maxLength={VERSION_NOTE_MAX_LENGTH}
                        rows={2}
                        placeholder='z. B. "Ton auf locker angepasst"'
                        data-testid="version-note-textarea"
                     />
                     <p className="text-xs text-muted-foreground">
                        Wird nur gespeichert, wenn du über „Speichern als neue
                        Version“ speicherst. {versionNote.length}/
                        {VERSION_NOTE_MAX_LENGTH}
                     </p>
                  </div>
               ) : (
                  <button
                     type="button"
                     onClick={() => setShowNoteField(true)}
                     className="flex cursor-pointer items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
                     data-testid="add-version-note-btn"
                  >
                     <ChevronRight className="h-3.5 w-3.5" />+ Notiz
                     hinzufügen
                  </button>
               )}
            </div>
         )}
      </section>
   );
};
