import { createContext } from "react";

import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";

import { DFiltersContext } from "./types";

export const initFilters: DPromptDescriptorsFilter = {
   search: "",
   categories: [],
};

export const FiltersContext = createContext<DFiltersContext | null>(null);
