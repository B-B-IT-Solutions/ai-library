import { Sort } from "@/data/types/common";
import { DCollectionUpdate, DCollectionsFilter } from "@/data/types/domain/collection";

export type LoadCollectionsPageParams = {
   filters?: DCollectionsFilter;
   sort?: Sort;
};

export type LoadCollectionPreviewsParams = {
   enabled: boolean;
};

export type UpdateCollectionParams = {
   collectionId: string;
   data: DCollectionUpdate;
};

export type LoadCollectionIdsParams = {
   entryId: string;
   enabled: boolean;
};

export type UpdateCollectionIdsParams = {
   entryId: string;
   collectionIds: string[];
};
