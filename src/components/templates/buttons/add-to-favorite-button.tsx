"use client";

import { useState, useTransition } from "react";
import { Loader } from "lucide-react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import {
   type UpdateIsFavoriteParams,
   useToggleFavorite,
} from "@/data/ts-queries/prompt";
import { DPrompt } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";

type Props = {
   descriptor: DPrompt;
};

export const AddToFavoriteButton = ({ descriptor }: Props) => {
   const [isFavorite, setFavorite] = useState<boolean>(descriptor.isFavorite);
   const [isPending, startTransition] = useTransition();
   const { mutate: toggleFavorite } = useToggleFavorite();

   const handleToggleFavorite = () => {
      const params: UpdateIsFavoriteParams = {
         descriptorId: descriptor.id,
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
         aria-pressed={descriptor.isFavorite}
         data-testid="toggle-favorite-btn"
      >
         {icon()}
      </button>
   );
};
