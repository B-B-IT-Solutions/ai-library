"use client";

import { FC, useTransition } from "react";
import { Loader, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { toggleFavorite } from "@/data/actions/prompt";
import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";

type ToggleFavoriteButtonProps = {
   prompt: DPromptDescriptor;
};

export const ToggleFavoriteButton: FC<ToggleFavoriteButtonProps> = ({
   prompt,
}) => {
   const { id: promptId, isFavorite } = prompt;

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

   const icon = () => {
      if (isPending) {
         return <Loader className="w-5 h-5 animate-spin text-slate-400" />;
      }
      const styles = isFavorite
         ? "fill-yellow-400 text-yellow-400"
         : "text-slate-400";
      return <Star className={cn("w-5 h-5", styles)} />;
   };

   return (
      <Button
         onClick={handleToggle}
         disabled={isPending}
         className="p-1 bg-transparent hover:bg-slate-100 rounded transition-colors cursor-pointer"
         title={
            isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
         }
         data-testid="toggle-favorite-btn"
      >
         {icon()}
      </Button>
   );
};
