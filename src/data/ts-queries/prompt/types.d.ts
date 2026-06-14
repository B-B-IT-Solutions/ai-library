import { Sort } from "@/data/types/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

export type LoadPromptsPageParams = {
   filters?: DPromptsFilter;
   sort?: Sort;
};

export type LoadPromptPreviewsPageParams = {
   filters?: DPromptsFilter;
   sort?: Sort;
};

export type UpdateIsFavoriteParams = {
   promptId: string;
   isFavorite: boolean;
};
