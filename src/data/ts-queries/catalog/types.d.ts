import {
   DCatalogEntriesFilter,
   DExploreSortMode,
} from "@/data/types/domain/catalog";

export type LoadCatalogEntriesParams = {
   filter?: DCatalogEntriesFilter;
   sort?: DExploreSortMode;
};
