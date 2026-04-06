"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Globe, Loader, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { setCollectionPublic } from "@/data/actions/collection";
import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
};

export const CollectionOther = ({ collection }: Props) => {
   const router = useRouter();
   const [isSubmitting, startTransition] = useTransition();

   const [copied, setCopied] = useState(false);

   const publicUrl = `${window.location.origin}/p/collections/${collection.publicToken}`;

   const handleToggleShare = () => {
      startTransition(async () => {
         const { id, isPublic } = collection;
         const result = await setCollectionPublic(id, !isPublic);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const handleCopy = async () => {
      if (!publicUrl) {
         return;
      }
      await navigator.clipboard.writeText(publicUrl);
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
                  disabled={isSubmitting}
               >
                  {isSubmitting ? (
                     <Loader className="h-4 w-4 animate-spin" />
                  ) : collection.isPublic ? (
                     "Deaktivieren"
                  ) : (
                     "Aktivieren"
                  )}
               </Button>
            </div>

            {collection.isPublic && publicUrl && (
               <div className="flex gap-2">
                  <div className="flex-1 truncate rounded-md border bg-slate-50 px-3 py-2 text-xs text-slate-600">
                     {publicUrl}
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
