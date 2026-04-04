import { Sort } from "@/data/types/common";
import { DCollectionUpdate } from "@/data/types/domain/collection";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";

export type LoadLibraryEntriesParams = {
   filters?: DTemplateDescriptorsFilter;
   sort?: Sort;
};

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
