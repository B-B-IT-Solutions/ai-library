import { Badge } from "@/components/shadcn/badge";
import { getPromptVariableTypeLabel } from "@/components/shared/template-fields";
import { DGlobalPromptField } from "@/data/types/domain/settings";

import { DeleteTemplateFieldButton, EditTemplateFieldButton } from "./buttons";

type Props = {
   field: DGlobalPromptField;
};

export const GlobalPromptFieldItem = ({ field }: Props) => {
   return (
      <div
         key={field.id}
         className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm"
         data-testid="template-field"
      >
         <div className="flex items-center gap-3">
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-sm text-slate-700">
               {`{{${field.name}}}`}
            </code>
            <span className="text-sm font-medium text-slate-900">
               {field.label}
            </span>
            <Badge variant="secondary" className="text-xs">
               {getPromptVariableTypeLabel(field.type)}
            </Badge>
         </div>
         <div className="flex items-center gap-1">
            <EditTemplateFieldButton field={field} />
            <DeleteTemplateFieldButton field={field} />
         </div>
      </div>
   );
};
