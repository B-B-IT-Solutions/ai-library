"use client";

import { FiltersContextProvider } from "./filters/context";
import { PromptsList } from "./prompts-list";

export const FiltersAwarePromptsList = () => {
   return (
      <div data-testid="filters-aware-prompts-list">
         <FiltersContextProvider>
            <PromptsList />
         </FiltersContextProvider>
      </div>
   );
};
