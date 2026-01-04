"use client";

import { FC, useTransition } from "react";
import { Loader, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { toggleFavorite } from "@/data/actions/prompt";

type ToggleFavoriteButtonProps = {
   promptId: string;
   isFavorite: boolean;
};

export const ToggleFavoriteButton: FC<ToggleFavoriteButtonProps> = ({
   promptId,
   isFavorite,
}) => {
   const [isPending, startTransition] = useTransition();

   const handleToggle = () => {
      startTransition(async () => {
         const result = await toggleFavorite(promptId, !isFavorite);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <Button
         onClick={handleToggle}
         disabled={isPending}
         className="p-1 bg-transparent hover:bg-slate-100 rounded transition-colors"
         title={isFavorite ? "Remove from favorites" : "Add to favorites"}
         data-testid="toggle-favorite-btn"
      >
         {isPending ? (
            <Loader className="w-5 h-5 animate-spin text-slate-400" />
         ) : (
            <Star
               className={`w-5 h-5 ${
                  isFavorite
                     ? "fill-yellow-400 text-yellow-400"
                     : "text-slate-400"
               }`}
            />
         )}
      </Button>
   );
};
