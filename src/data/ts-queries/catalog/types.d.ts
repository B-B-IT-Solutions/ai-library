import { DCatalogEntriesFilter } from "@/data/types/domain/catalog";

export type LoadCatalogEntriesParams = {
   filters?: DCatalogEntriesFilter;
   sort?: Sort;
};
