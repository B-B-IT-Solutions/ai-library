import { Sort } from "@/data/types/common";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";

export type LoadTemplateDescriptorsParams = {
   filters?: DTemplateDescriptorsFilter;
   sort?: Sort;
};

export type UpdateIsFavoriteParams = {
   descriptorId: string;
   isFavorite: boolean;
};
