"use client";

import { useTransition } from "react";
import { Globe, Loader, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { CopyButton } from "@/components/shared/buttons";
import { setCollectionPublic } from "@/data/actions/collection";
import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
};

export const CollectionOther = ({ collection }: Props) => {
   const router = useRouter();

   const [isSubmitting, startTransition] = useTransition();

   const publicUrl = `${window.location.origin}/p/collections/${collection.publicToken}`;

   const { id, isPublic } = collection;

   const handleTogglePublic = () => {
      startTransition(async () => {
         const result = await setCollectionPublic(id, !isPublic);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const publicToggle = () => {
      return (
         <div
            className="flex items-center justify-between rounded-lg border p-3"
            data-testid="public-toggle"
         >
            <div className="flex items-center gap-2.5">
               {isPublic ? (
                  <Globe className="h-4 w-4 text-green-600" />
               ) : (
                  <Lock className="h-4 w-4 text-slate-400" />
               )}
               <div>
                  <p className="text-sm font-medium">
                     {isPublic ? "Öffentlich" : "Privat"}
                  </p>
                  <p className="text-xs text-slate-500">
                     {isPublic
                        ? "Jeder mit Link kann ansehen"
                        : "Nur für Sie sichtbar"}
                  </p>
               </div>
            </div>
            <Button
               type="button"
               variant={isPublic ? "destructive" : "outline"}
               size="sm"
               onClick={handleTogglePublic}
               disabled={isSubmitting}
               data-testid="public-toggle-btn"
            >
               {isSubmitting ? (
                  <Loader className="h-4 w-4 animate-spin" />
               ) : isPublic ? (
                  "Deaktivieren"
               ) : (
                  "Aktivieren"
               )}
            </Button>
         </div>
      );
   };

   const url = () => {
      if (isPublic) {
         return (
            <div className="flex gap-2">
               <div
                  className="flex-1 truncate rounded-md border bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  data-testid="public-url"
               >
                  {publicUrl}
               </div>
               <CopyButton
                  content={publicUrl}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  data-testid="copy-url-btn"
               />
            </div>
         );
      }
   };

   return (
      <Card data-testid="collection-other">
         <CardContent className="space-y-3 pt-6">
            <p className="text-sm font-semibold text-slate-700">Freigabe</p>
            {publicToggle()}
            {url()}
         </CardContent>
      </Card>
   );
};
