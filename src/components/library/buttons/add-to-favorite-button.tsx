"use client";

import { FC, useTransition } from "react";
import { Loader } from "lucide-react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { useToggleFavorite } from "@/data/ts-queries/library";
import { DLibraryEntry } from "@/data/types/domain/library";
import { cn } from "@/lib/utils";

type Props = {
   entry: DLibraryEntry;
};

export const AddToFavoriteButton: FC<Props> = ({ entry }) => {
   const [isPending, startTransition] = useTransition();
   const { mutate: toggleFavorite } = useToggleFavorite();

   const handleToggleFavorite = () => {
      toggleFavorite(
         {
            entryId: entry.id,
            isFavorite: !entry.isFavorite,
         },
         {
            onSuccess: (result) => {
               if (result.success) {
                  toast.success(result.message);
               } else {
                  toast.error(result.message);
               }
            },
            onError: () => {
               toast.error("Fehler beim Aktualisieren der Favoriten");
            },
         }
      );
   };

   const handleDownload = () => {
      startTransition(async () => {
         // const result = await downloadTemplate(descriptor.id);
         // if (result.success && result.data) {
         //    const blob = new Blob([result.data], {
         //       type: "application/json",
         //    });
         //    const fileName = `${descriptor.title.replace(/\s+/g, "_")}.json`;
         //    saveAs(blob, fileName);
         //    toast.success("Vorlage heruntergeladen!");
         // } else {
         //    toast.error(result.message);
         // }
      });
   };

   const icon = () => {
      if (isPending) {
         return <Loader className="mr-1.5 h-4 w-4 animate-spin" />;
      }

      return (
         <Star
            className={cn(
               "h-4 w-4 transition-colors",
               entry.isFavorite
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
            entry.isFavorite
               ? "Aus Favoriten entfernen"
               : "Zu Favoriten hinzufügen"
         }
         aria-pressed={entry.isFavorite}
      >
         {icon()}
      </button>
   );
};
