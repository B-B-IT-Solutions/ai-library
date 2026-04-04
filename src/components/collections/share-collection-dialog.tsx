"use client";

import { FC, useState } from "react";
import { Check, Copy, Globe, Loader, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { useSetCollectionSharing } from "@/data/ts-queries/library";
import { DLibraryCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DLibraryCollection;
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export const ShareCollectionDialog: FC<Props> = ({
   collection,
   open,
   onOpenChange,
}) => {
   const { mutate: setSharing, isPending } = useSetCollectionSharing();
   const [copied, setCopied] = useState(false);

   const shareUrl = collection.shareToken
      ? `${window.location.origin}/p/collections/${collection.shareToken}`
      : null;

   const handleTogglePublic = () => {
      setSharing(
         { collectionId: collection.id, isPublic: !collection.isPublic },
         {
            onSuccess: (result) => {
               if (!result.success) {
                  toast.error(result.message);
               }
            },
            onError: () => {
               toast.error("Freigabe konnte nicht geändert werden");
            },
         }
      );
   };

   const handleCopy = async () => {
      if (!shareUrl) return;
      try {
         await navigator.clipboard.writeText(shareUrl);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
         toast.success("Link kopiert");
      } catch {
         toast.error("Link konnte nicht kopiert werden");
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            className="max-w-md"
            data-testid="share-collection-dialog"
         >
            <DialogHeader>
               <DialogTitle>Sammlung teilen</DialogTitle>
               <DialogDescription>
                  Geben Sie diese Sammlung für Personen ohne Konto frei.
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
               <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                     {collection.isPublic ? (
                        <Globe className="h-5 w-5 text-green-600" />
                     ) : (
                        <Lock className="h-5 w-5 text-slate-400" />
                     )}
                     <div>
                        <p className="text-sm font-medium">
                           {collection.isPublic
                              ? "Öffentlich zugänglich"
                              : "Privat"}
                        </p>
                        <p className="text-xs text-slate-500">
                           {collection.isPublic
                              ? "Jeder mit dem Link kann diese Sammlung ansehen"
                              : "Nur Sie können diese Sammlung sehen"}
                        </p>
                     </div>
                  </div>
                  <Button
                     variant={collection.isPublic ? "destructive" : "default"}
                     size="sm"
                     onClick={handleTogglePublic}
                     disabled={isPending}
                  >
                     {isPending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                     ) : collection.isPublic ? (
                        "Deaktivieren"
                     ) : (
                        "Aktivieren"
                     )}
                  </Button>
               </div>

               {collection.isPublic && shareUrl && (
                  <div className="space-y-2">
                     <p className="text-sm font-medium text-slate-700">
                        Freigabe-Link
                     </p>
                     <div className="flex gap-2">
                        <div className="flex-1 truncate rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-600">
                           {shareUrl}
                        </div>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={handleCopy}
                           className="shrink-0"
                        >
                           {copied ? (
                              <Check className="h-4 w-4 text-green-600" />
                           ) : (
                              <Copy className="h-4 w-4" />
                           )}
                        </Button>
                     </div>
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};
