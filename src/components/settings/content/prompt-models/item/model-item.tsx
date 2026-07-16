import { Badge } from "@/components/shadcn/badge";
import { DPromptModelWithUsage } from "@/data/types/domain/prompt";
import { DeleteModelButton, UpdateModelButton } from "../buttons";

type Props = {
   model: DPromptModelWithUsage;
};

const promptsLabel = (count: number) => {
   return count === 1 ? "1 Prompt" : `${count} Prompts`;
};

export const ModelItem = ({ model }: Props) => {
   return (
      <div
         key={model.id}
         className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm"
         data-testid="model-item"
      >
         <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-900">
               {model.name}
            </span>
            <Badge variant="secondary" className="text-xs">
               {promptsLabel(model.count)}
            </Badge>
         </div>
         <div className="flex items-center gap-1">
            <UpdateModelButton model={model} />
            <DeleteModelButton model={model} />
         </div>
      </div>
   );
};
