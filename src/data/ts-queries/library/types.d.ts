import {
   DLibraryCollectionUpdate,
   DLibraryEntriesFilter,
} from "@/data/types/domain/library";

export type LoadLibraryEntriesParams = {
   filters?: DLibraryEntriesFilter;
};

export type UpdateIsFavoriteParams = {
   entryId: string;
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
