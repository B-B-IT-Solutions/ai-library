import { DCatalogEntryCategory } from "@/data/types/domain/catalog";

import { CatalogFilterContent } from "./catalog-filter-content";

type Props = {
   categories: DCatalogEntryCategory[];
   totalElements: number;
};

export const CatalogSidebar = ({ categories, totalElements }: Props) => {
   return (
      <aside
         className="hidden w-64 shrink-0 md:block"
         data-testid="catalog-entries-sidebar"
      >
         <div className="rounded-xl border bg-white shadow-sm">
            <CatalogFilterContent
               categories={categories}
               totalElements={totalElements}
            />
         </div>
      </aside>
   );
};
