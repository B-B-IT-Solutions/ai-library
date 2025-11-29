import { FC } from "react";
import { map } from "es-toolkit/compat";
import { Search } from "lucide-react";

type TemplateFiltersProps = {
   categories: string[];
   search: string;
   category: string;
   setSearch: (value: string) => void;
   setCategory: (value: string) => void;
};

export const TemplateFilters: FC<TemplateFiltersProps> = ({
   categories,
   search: search,
   setSearch: setSearch,
   category,
   setCategory,
}) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
               type="text"
               placeholder="Search templates..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
         </div>
         <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         >
            <option value="all">All Categories</option>
            {map(categories, (cat) => (
               <option key={cat} value={cat}>
                  {cat}
               </option>
            ))}
         </select>
      </div>
   );
};
