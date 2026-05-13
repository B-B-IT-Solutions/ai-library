import { Sort } from "@/data/types/common";
import { DPromptsFilter } from "@/data/types/domain/prompt";

export type LoadTemplateDescriptorsParams = {
   filters?: DPromptsFilter;
   sort?: Sort;
};

export type UpdateIsFavoriteParams = {
   descriptorId: string;
   isFavorite: boolean;
};
