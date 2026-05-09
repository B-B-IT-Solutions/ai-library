"use client";

import { useEffect, useState } from "react";

import { isAuthenticated } from "@/data/actions/auth-utils";
import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "./items";

type Props = {
   entries: DCatalogEntry[];
};

export const CatalogEntriesGrid = ({ entries }: Props) => {
   const [isAuth, setIsAuth] = useState(false);

   useEffect(() => {
      isAuthenticated().then(setIsAuth);
   }, []);

   return (
      <div
         className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
         data-testid="catalog-entries-grid"
      >
         {entries.map((entry) => (
            <CatalogEntryItem
               key={entry.id}
               entry={entry}
               isAuthenticated={isAuth}
            />
         ))}
      </div>
   );
};
