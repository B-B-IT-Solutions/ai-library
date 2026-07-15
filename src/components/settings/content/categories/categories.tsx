import { isEmpty, map } from "es-toolkit/compat";
import { Tag } from "lucide-react";

import { getCategoriesWithUsage } from "@/data/actions/prompt";
import { DPromptCategoryUsage } from "@/data/types/domain/prompt";

import { CategoryItem } from "./category-item";

export const Categories = async () => {
   const categories = await getCategoriesWithUsage();

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
                  Kategorien werden automatisch angelegt, sobald du sie einem
                  Prompt zuweist
               </p>
            </div>
         );
      }
   };

   const renderCategory = (category: DPromptCategoryUsage) => {
      return <CategoryItem category={category} key={category.id} />;
   };

   const renderCategories = () => {
      if (isEmpty(categories)) {
         return;
      }
      return <div className="space-y-2">{map(categories, renderCategory)}</div>;
   };

   return (
      <div className="space-y-6" data-testid="categories">
         <div>
            <h2 className="text-xl font-semibold text-slate-900">
               Kategorien
            </h2>
            <p className="mt-1 text-sm text-slate-500">
               Benenne Kategorien um oder lösche sie. Änderungen wirken sich
               auf alle verknüpften Prompts aus.
            </p>
         </div>

         {renderCategories()}

         {emptyState()}
      </div>
   );
};
