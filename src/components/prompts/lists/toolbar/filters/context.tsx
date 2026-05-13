import { createContext } from "react";

import { DPrompt0sFilter } from "@/data/types/domain/prompt";

import { DFiltersContext } from "./types";

export const initFilters: DPrompt0sFilter = {
   search: "",
   categories: [],
};

export const FiltersContext = createContext<DFiltersContext | null>(null);
