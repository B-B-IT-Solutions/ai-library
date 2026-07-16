import { Badge } from "@/components/shadcn/badge";
import { DPromptCategoryWithUsage } from "@/data/types/domain/prompt";
import { DeleteCategoryButton, UpdateCategoryButton } from "../buttons";

type Props = {
   category: DPromptCategoryWithUsage;
};

const promptsLabel = (count: number) => {
   return count === 1 ? "1 Prompt" : `${count} Prompts`;
};

export const CategoryItem = ({ category }: Props) => {
   return (
      <div
         key={category.id}
         className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm"
         data-testid="category-item"
      >
         <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-900">
               {category.name}
            </span>
            <Badge variant="secondary" className="text-xs">
               {promptsLabel(category.count)}
            </Badge>
         </div>
         <div className="flex items-center gap-1">
            <UpdateCategoryButton category={category} />
            <DeleteCategoryButton category={category} />
         </div>
      </div>
   );
};
