import { Sort } from "@/data/types/common";
import { DCollectionsFilter } from "@/data/types/domain/collection";

export type LoadCollectionsPageParams = {
   filters?: DCollectionsFilter;
   sort?: Sort;
};

export type AddPromptToCollectionParams = {
   collectionId: string;
   promptId: string;
};

export type RemovePromptFromCollectionParams = {
   collectionId: string;
   promptId: string;
};
