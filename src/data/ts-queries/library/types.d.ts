import { DCollectionUpdate } from "@/data/types/domain/collection";

export type UpdateIsFavoriteParams = {
   descriptorId: string;
   isFavorite: boolean;
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
