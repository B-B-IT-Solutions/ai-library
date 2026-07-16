import { isEmpty, map } from "es-toolkit/compat";
import { Tag } from "lucide-react";

import { getPromptCategoriesWithUsage } from "@/data/actions/prompt";
import { DPromptCategoryWithUsage } from "@/data/types/domain/prompt";

import { CreateCategoryButton } from "./buttons";
import { CategoryItem } from "./item";

export const Categories = async () => {
   const categories = await getPromptCategoriesWithUsage();

   const emptyState = () => {
      if (isEmpty(categories)) {
         return (
            <div
               className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center"
               data-testid="categories-empty"
            >
               <Tag className="mx-auto mb-3 h-8 w-8 text-slate-400" />
               <p className="font-medium text-slate-600">
                  Noch keine Kategorien
               </p>
               <p className="mt-1 text-sm text-slate-400">
                  Erstelle deine erste Kategorie oder weise sie direkt einem
                  Prompt zu
               </p>
            </div>
         );
      }
   };

   const renderCategory = (category: DPromptCategoryWithUsage) => {
      return <CategoryItem category={category} key={category.id} />;
   };

   const renderCategories = () => {
      if (isEmpty(categories)) {
         return;
      }
      return <div className="space-y-2">{map(categories, renderCategory)}</div>;
   };

   return (
      <div className="space-y-6" data-testid="prompt-categories">
         <div className="flex items-start justify-between gap-4">
            <div>
               <h2 className="text-xl font-semibold text-slate-900">
                  Prompts Kategorien
               </h2>
               <p className="mt-1 text-sm text-slate-500">
                  Verwalte deine Prompts Kategorien. Änderungen wirken sich
                  auf alle verknüpften Prompts aus.
               </p>
            </div>
            <CreateCategoryButton />
         </div>

         {renderCategories()}

         {emptyState()}
      </div>
   );
};
