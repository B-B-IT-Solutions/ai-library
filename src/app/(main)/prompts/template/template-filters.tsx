import { Search } from "lucide-react";
import { FC } from "react";

type TemplateFiltersProps = {
   search: string;
   category: string;
   setSearch: (value: string) => void;
   setCategory: (value: string) => void;
   categories: string[];
};

export const TemplateFilters: FC<TemplateFiltersProps> = ({
   search: templateSearch,
   setSearch: setTemplateSearch,
   category: templateCategory,
   setCategory: setTemplateCategory,
   categories: templateCategories,
}) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
               type="text"
               placeholder="Search templates..."
               value={templateSearch}
               onChange={(e) => setTemplateSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
         </div>
         <select
            value={templateCategory}
            onChange={(e) => setTemplateCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         >
            <option value="all">All Categories</option>
            {templateCategories.map((cat) => (
               <option key={cat} value={cat}>
                  {cat}
               </option>
            ))}
         </select>
      </div>
   );
};
