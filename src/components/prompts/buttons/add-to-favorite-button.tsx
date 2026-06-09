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
   prompt: DPrompt;
   variant?: "card" | "inline";
   hideInactive?: boolean;
};

export const AddToFavoriteButton = ({
   prompt,
   variant = "card",
   hideInactive = false,
}: Props) => {
   const [isFavorite, setFavorite] = useState<boolean>(prompt.isFavorite);
   const [isPending, startTransition] = useTransition();
   const { mutate: toggleFavorite } = useToggleFavorite();

   const handleToggleFavorite = () => {
      const params: UpdateIsFavoriteParams = {
         promptId: prompt.id,
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

   const buttonClass =
      variant === "inline"
         ? cn(
              "rounded-full p-1.5 transition-all hover:bg-slate-100",
              hideInactive &&
                 !isFavorite &&
                 "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
           )
         : "absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 shadow-sm transition-all hover:bg-white";

   return (
      <button
         onClick={handleToggleFavorite}
         className={buttonClass}
         aria-label={
            isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
         }
         aria-pressed={prompt.isFavorite}
         data-testid="toggle-favorite-btn"
      >
         {icon()}
      </button>
   );
};
