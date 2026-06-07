import { DCollectionUpdate } from "@/data/types/domain/collection";

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
