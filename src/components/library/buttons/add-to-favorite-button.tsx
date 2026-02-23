"use client";

import { FC, useState, useTransition } from "react";
import { Loader } from "lucide-react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import {
   UpdateIsFavoriteParams,
   useToggleFavorite,
} from "@/data/ts-queries/library";
import { DLibraryEntry } from "@/data/types/domain/library";
import { cn } from "@/lib/utils";

type Props = {
   entry: DLibraryEntry;
};

export const AddToFavoriteButton: FC<Props> = ({ entry }) => {
   const [isFavorite, setFavorite] = useState<boolean>(entry.isFavorite);
   const [isPending, startTransition] = useTransition();
   const { mutate: toggleFavorite } = useToggleFavorite();

   const handleToggleFavorite = () => {
      const params: UpdateIsFavoriteParams = {
         entryId: entry.id,
         isFavorite: !isFavorite,
      };
      startTransition(async () => {
         toggleFavorite(params, {
            onSuccess: (result) => {
               if (result.success) {
                  setFavorite(params.isFavorite);
                  toast.success(result.message);
               } else {
                  toast.error(result.message);
               }
            },
            onError: () => {
               toast.error("Fehler beim Aktualisieren der Favoriten");
            },
         });
      });
   };

   const icon = () => {
      if (isPending) {
         return <Loader className="h-4 w-4 animate-spin text-slate-400" />;
      }

      return (
         <Star
            className={cn(
               "h-4 w-4 transition-colors",
               isFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-400 hover:text-yellow-400"
            )}
         />
      );
   };

   return (
      <button
         onClick={handleToggleFavorite}
         className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 shadow-sm transition-all hover:bg-white"
         aria-label={
            isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
         }
         aria-pressed={entry.isFavorite}
         data-testid="toggle-favorite-btn"
      >
         {icon()}
      </button>
   );
};
