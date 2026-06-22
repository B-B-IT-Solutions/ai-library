import { DCatalogEntryCategory } from "@/data/types/domain/catalog";
import { CatalogEntryFilters } from "../toolbar/filters";

type Props = {
   categories: DCatalogEntryCategory[];
};

export const CatalogSidebar = ({ categories }: Props) => {
   return (
      <aside
         className="hidden w-64 shrink-0 md:block"
         data-testid="catalog-entries-sidebar"
      >
         <div className="rounded-xl border bg-white shadow-sm">
            <CatalogEntryFilters categories={categories} />
         </div>
      </aside>
   );
};
