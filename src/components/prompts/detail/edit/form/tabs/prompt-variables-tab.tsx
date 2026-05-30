"use client";

import { useMemo } from "react";
import { filter, includes, upperFirst } from "es-toolkit/compat";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { TabsContent } from "@/components/shadcn/tabs";
import { newTemplateFieldInitValues } from "@/components/shared/template-fields";
import { DPromptUpdate, DPromptVariable } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { DetectedVariables, PromptVariables } from "../sections";
import { extractVariablesFromContent, getVariableStatus } from "../utils";

type Props = {
   form: UseFormReturn<DPromptUpdate>;
   globalFields: DGlobalPromptField[];
};

export const PromptVariablesTab = ({ form, globalFields }: Props) => {
   const {
      fields,
      append: addField,
      remove: removeField,
   } = useFieldArray({
      control: form.control,
      name: "fields",
   });

   const content = form.watch("content");
   const globalFieldIds = form.watch("globalFieldIds");
   const watchedFields = form.watch("fields");

   const detectedVariables = useMemo(
      () => extractVariablesFromContent(content || ""),
      [content]
   );

   const variableStatus = useMemo(() => {
      const templateFieldNames = watchedFields.map((f) => f.name);
      const globalFieldNames = globalFields
         .filter((gf) => includes(globalFieldIds, gf.id))
         .map((gf) => gf.name);

      const allFieldNames = [...templateFieldNames, ...globalFieldNames];
      return getVariableStatus(detectedVariables, allFieldNames);
   }, [detectedVariables, watchedFields, globalFields, globalFieldIds]);

   const handleAddField = () => {
      const order = fields.length;
      addField(newTemplateFieldInitValues(order));
   };

   const handleAddVariableAsField = (variableName: string) => {
      const order = fields.length;
      const label = upperFirst(variableName);
      addField(newTemplateFieldInitValues(order, variableName, label));
      toast.success(`Feld "${variableName}" hinzugefügt`);
   };

   const handleSyncAllVariables = () => {
      let addedCount = 0;
      variableStatus.undefined.forEach((varName) => {
         handleAddVariableAsField(varName);
         addedCount++;
      });
      toast.success(`${addedCount} Feld(er) synchronisiert`);
   };

   const handleAddGlobalFieldIds = (newIds: string[]) => {
      const current = form.getValues("globalFieldIds");
      form.setValue("globalFieldIds", [...current, ...newIds]);
      toast.success(`${newIds.length} globale Feld(er) hinzugefügt`);
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
         value="variables"
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
            onAddGlobalFieldIds={handleAddGlobalFieldIds}
            onRemoveGlobalFieldId={handleRemoveGlobalFieldId}
            control={form.control}
            watch={form.watch}
         />
      </TabsContent>
   );
};
