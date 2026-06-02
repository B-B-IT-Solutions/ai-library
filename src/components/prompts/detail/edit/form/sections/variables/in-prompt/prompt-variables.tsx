"use client";

import {
   closestCenter,
   DndContext,
   DragEndEvent,
   PointerSensor,
   useSensor,
   useSensors,
} from "@dnd-kit/core";
import {
   SortableContext,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { filter, includes, isEmpty, map } from "es-toolkit/compat";
import { Plus } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { GlobalPromptFieldsPicker } from "@/components/shared/template-fields";
import { CallbackFn } from "@/data/types/common";
import { DPromptUpdate, DPromptVariable } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";

import { PromptGlobalVariable } from "./prompt-global-variable";
import { PromptVariable } from "./prompt-variable";
import { resolveDragEnd } from "./utils";

type Props = {
   fields: DPromptVariable[];
   detectedVariables: string[];
   globalFields: DGlobalPromptField[];
   globalFieldIds: string[];
   onAddField: CallbackFn;
   onRemoveField: (index: number) => void;
   onMoveField: (from: number, to: number) => void;
   onAddGlobalFieldIds: (ids: string[]) => void;
   onRemoveGlobalFieldId: (id: string) => void;
   control: Control<DPromptUpdate>;
   watch: UseFormWatch<DPromptUpdate>;
};

export const PromptVariables = ({
   fields,
   detectedVariables,
   globalFields,
   globalFieldIds,
   onAddField,
   onRemoveField,
   onMoveField,
   onAddGlobalFieldIds,
   onRemoveGlobalFieldId,
   control,
   watch,
}: Props) => {
   const sensors = useSensors(useSensor(PointerSensor));

   const handleDragEnd = (event: DragEndEvent) => {
      resolveDragEnd(event.active.id, event.over?.id, fields, onMoveField);
   };
   const resolvedGlobalFields = filter(globalFields, (f) =>
      includes(globalFieldIds, f.id)
   );

   const header = () => {
      return (
         <div className="mb-1 space-y-3">
            <div>
               <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                  Platzhalter konfigurieren
               </p>
               <p className="mt-1 text-sm text-slate-500">
                  Legen Sie fest, wie jeder Platzhalter im Formular beim
                  Anwenden des Prompts erscheint
               </p>
            </div>
            <div className="flex items-center justify-end gap-2">
               <Button
                  type="button"
                  onClick={onAddField}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  data-testid="add-btn"
               >
                  <Plus className="mr-1 h-4 w-4" />
                  Platzhalter hinzufügen
               </Button>
               <GlobalPromptFieldsPicker
                  globalFields={globalFields}
                  selectedGlobalFieldIds={globalFieldIds}
                  onAddFields={onAddGlobalFieldIds}
               />
            </div>
         </div>
      );
   };

   const renderGlobalField = (field: DGlobalPromptField) => {
      const isUsed = includes(detectedVariables, field.name);
      return (
         <PromptGlobalVariable
            key={field.id}
            field={field}
            isUsed={isUsed}
            onRemoveGlobalFieldId={onRemoveGlobalFieldId}
         />
      );
   };

   const renderGlobalFields = () => {
      if (!isEmpty(resolvedGlobalFields)) {
         return (
            <div className="space-y-2" data-testid="prompt-global-variables">
               <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                  Globale Platzhalter
               </p>
               {map(resolvedGlobalFields, renderGlobalField)}
            </div>
         );
      }
   };

   const renderTemplateField = (field: DPromptVariable, idx: number) => {
      const fieldName = watch(`fields.${idx}.name`);
      const isUsed = detectedVariables.includes(fieldName);

      return (
         <PromptVariable
            key={field.id}
            id={field.id}
            index={idx}
            isUsed={isUsed}
            onRemove={() => onRemoveField(idx)}
            control={control}
            watch={watch}
         />
      );
   };

   const renderTemplateFields = () => {
      if (isEmpty(fields)) {
         const hasDetectedVariables = !isEmpty(detectedVariables);
         return (
            <div
               className="mt-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center"
               data-testid="fields-empty"
            >
               {hasDetectedVariables ? (
                  <>
                     <p className="text-slate-500">
                        Noch keine Platzhalter konfiguriert
                     </p>
                     <p className="mt-1 text-sm text-slate-400">
                        Fügen Sie die erkannten Platzhalter oben hinzu oder
                        klicken Sie auf &quot;Platzhalter hinzufügen&quot;
                     </p>
                  </>
               ) : (
                  <>
                     <p className="text-slate-500">
                        Noch keine Platzhalter konfiguriert
                     </p>
                     <p className="mt-1 text-sm text-slate-400">
                        Klicken Sie auf &quot;Platzhalter hinzufügen&quot;, um
                        zu beginnen
                     </p>
                  </>
               )}
            </div>
         );
      }
      return (
         <div className="space-y-2" data-testid="fields">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
               Prompt Platzhalter
            </p>
            <DndContext
               sensors={sensors}
               collisionDetection={closestCenter}
               onDragEnd={handleDragEnd}
            >
               <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
               >
                  <div className="space-y-4">
                     {map(fields, (field, idx) =>
                        renderTemplateField(field, idx)
                     )}
                  </div>
               </SortableContext>
            </DndContext>
         </div>
      );
   };

   return (
      <section className="space-y-5" data-testid="prompt-variables">
         {header()}
         {renderGlobalFields()}
         {renderTemplateFields()}
      </section>
   );
};
