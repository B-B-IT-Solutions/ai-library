import { Sort } from "@/data/types/common";
import { DLibraryCollectionUpdate } from "@/data/types/domain/library";
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
