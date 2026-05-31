"use client";

import { filter, upperFirst } from "es-toolkit/compat";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { TabsContent } from "@/components/shadcn/tabs";
import { newTemplateFieldInitValues } from "@/components/shared/template-fields";
import { DPromptUpdate, DPromptVariable } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { DetectedVariables, PromptVariables } from "../sections";
import { VariableStatus } from "../utils/variables";

type Props = {
   tabId: string;
   form: UseFormReturn<DPromptUpdate>;
   globalFields: DGlobalPromptField[];
   detectedVariables: string[];
   variableStatus: VariableStatus;
};

export const PromptVariablesTab = ({
   tabId,
   form,
   globalFields,
   detectedVariables,
   variableStatus,
}: Props) => {
   const {
      fields,
      append: addField,
      remove: removeField,
      move: moveField,
   } = useFieldArray({
      control: form.control,
      name: "fields",
   });

   const handleMoveField = (from: number, to: number) => {
      moveField(from, to);
      const updatedFields = form.getValues("fields");
      updatedFields.forEach((_, index) => {
         form.setValue(`fields.${index}.order`, index, { shouldDirty: true });
      });
   };

   const handleAddField = () => {
      const order = fields.length;
      addField(newTemplateFieldInitValues(order));
   };

   const handleAddVariableAsField = (variableName: string) => {
      const order = fields.length;
      const label = upperFirst(variableName);
      addField(newTemplateFieldInitValues(order, variableName, label));
      toast.success(`Platzhalter "${variableName}" hinzugefügt`);
   };

   const handleSyncAllVariables = () => {
      let addedCount = 0;
      variableStatus.undefined.forEach((varName) => {
         handleAddVariableAsField(varName);
         addedCount++;
      });
      toast.success(`${addedCount} Platzhalter synchronisiert`);
   };

   const handleAddGlobalFieldIds = (newIds: string[]) => {
      const current = form.getValues("globalFieldIds");
      form.setValue("globalFieldIds", [...current, ...newIds]);
      toast.success(`${newIds.length} globaler Platzhalter hinzugefügt`);
   };

   const handleRemoveGlobalFieldId = (id: string) => {
      const current = form.getValues("globalFieldIds");
      form.setValue(
         "globalFieldIds",
         filter(current, (i) => i !== id)
      );
   };

   return (
      <TabsContent
         value={tabId}
         className="space-y-8"
         data-testid="prompt-variables-tab"
      >
         <DetectedVariables
            detectedVariables={detectedVariables}
            variableStatus={variableStatus}
            onAddVariable={handleAddVariableAsField}
            onSyncAll={handleSyncAllVariables}
         />
         <PromptVariables
            fields={fields as DPromptVariable[]}
            detectedVariables={detectedVariables}
            globalFields={globalFields}
            globalFieldIds={form.watch("globalFieldIds")}
            onAddField={handleAddField}
            onRemoveField={removeField}
            onMoveField={handleMoveField}
            onAddGlobalFieldIds={handleAddGlobalFieldIds}
            onRemoveGlobalFieldId={handleRemoveGlobalFieldId}
            control={form.control}
            watch={form.watch}
         />
      </TabsContent>
   );
};
