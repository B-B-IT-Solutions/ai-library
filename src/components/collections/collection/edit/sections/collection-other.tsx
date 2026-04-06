"use client";

import { useState } from "react";
import { Check, Copy, Globe, Loader, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { useSetCollectionSharing } from "@/data/ts-queries/library";
import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
};

export const CollectionOther = ({ collection }: Props) => {
   const { mutate: setSharing, isPending: isTogglingShare } =
      useSetCollectionSharing();
   const [copied, setCopied] = useState(false);

   const shareUrl =
      typeof window !== "undefined" && collection.shareToken
         ? `${window.location.origin}/p/collections/${collection.shareToken}`
         : null;

   const handleToggleShare = () => {
      setSharing(
         { collectionId: collection.id, isPublic: !collection.isPublic },
         {
            onSuccess: (result) => {
               if (!result.success) toast.error(result.message);
            },
         }
      );
   };

   const handleCopy = async () => {
      if (!shareUrl) {
         return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link kopiert");
   };

   return (
      <Card data-testid="collection-other">
         <CardContent className="space-y-3 pt-6">
            <p className="text-sm font-semibold text-slate-700">Freigabe</p>
            <div className="flex items-center justify-between rounded-lg border p-3">
               <div className="flex items-center gap-2.5">
                  {collection.isPublic ? (
                     <Globe className="h-4 w-4 text-green-600" />
                  ) : (
                     <Lock className="h-4 w-4 text-slate-400" />
                  )}
                  <div>
                     <p className="text-sm font-medium">
                        {collection.isPublic ? "Öffentlich" : "Privat"}
                     </p>
                     <p className="text-xs text-slate-500">
                        {collection.isPublic
                           ? "Jeder mit Link kann ansehen"
                           : "Nur für Sie sichtbar"}
                     </p>
                  </div>
               </div>
               <Button
                  type="button"
                  variant={collection.isPublic ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleToggleShare}
                  disabled={isTogglingShare}
               >
                  {isTogglingShare ? (
                     <Loader className="h-4 w-4 animate-spin" />
                  ) : collection.isPublic ? (
                     "Deaktivieren"
                  ) : (
                     "Aktivieren"
                  )}
               </Button>
            </div>

            {collection.isPublic && shareUrl && (
               <div className="flex gap-2">
                  <div className="flex-1 truncate rounded-md border bg-slate-50 px-3 py-2 text-xs text-slate-600">
                     {shareUrl}
                  </div>
                  <Button
                     type="button"
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
            )}
         </CardContent>
      </Card>
   );
};
