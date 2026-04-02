import { Sort } from "@/data/types/common";
import {
   DLibraryCollectionUpdate,
   DLibraryEntriesFilter,
} from "@/data/types/domain/library";

export type LoadLibraryEntriesParams = {
   filters?: DLibraryEntriesFilter;
   sort?: Sort;
};

export type UpdateIsFavoriteParams = {
   descriptorId: string;
   isFavorite: boolean;
};

export type UpdateCollectionParams = {
   collectionId: string;
   data: DLibraryCollectionUpdate;
};

export type LoadCollectionIdsParams = {
   entryId: string;
   enabled: boolean;
};

export type UpdateCollectionIdsParams = {
   entryId: string;
   collectionIds: string[];
};
