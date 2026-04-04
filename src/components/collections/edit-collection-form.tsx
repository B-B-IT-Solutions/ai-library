"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Globe, Loader, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import { FormInput, FormTextArea } from "@/components/shared/widgets";
import {
   useSetCollectionSharing,
   useUpdateCollection,
} from "@/data/ts-queries/library";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/collection";
import { updateLibraryCollectionSchema } from "@/data/types/validators/library";

type Props = {
   collection: DLibraryCollection;
};

export const EditCollectionForm: FC<Props> = ({ collection }) => {
   const router = useRouter();
   const { mutate: updateCollection, isPending: isSaving } =
      useUpdateCollection();
   const { mutate: setSharing, isPending: isTogglingShare } =
      useSetCollectionSharing();
   const [copied, setCopied] = useState(false);

   const form = useForm<DLibraryCollectionUpdate>({
      resolver: zodResolver(updateLibraryCollectionSchema),
      defaultValues: {
         name: collection.name,
         description: collection.description ?? "",
         color: collection.color ?? "#3b82f6",
         order: collection.order,
      },
   });

   useEffect(() => {
      form.reset({
         name: collection.name,
         description: collection.description ?? "",
         color: collection.color ?? "#3b82f6",
         order: collection.order,
      });
   }, [collection.id, form]);

   const shareUrl =
      typeof window !== "undefined" && collection.shareToken
         ? `${window.location.origin}/p/collections/${collection.shareToken}`
         : null;

   const onSubmit = (data: DLibraryCollectionUpdate) => {
      updateCollection(
         { collectionId: collection.id, data },
         {
            onSuccess: (result) => {
               if (result.success) {
                  toast.success(result.message);
               } else {
                  toast.error(result.message);
               }
            },
            onError: () => toast.error("Fehler beim Speichern"),
         }
      );
   };

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
      if (!shareUrl) return;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link kopiert");
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormInput<DLibraryCollectionUpdate>
               name="name"
               label="Name"
               required={true}
               control={form.control}
            />
            <FormTextArea<DLibraryCollectionUpdate>
               name="description"
               label="Beschreibung"
               placeholder="Wofür wird diese Sammlung verwendet?"
               control={form.control}
            />
            <FormInput<DLibraryCollectionUpdate>
               name="color"
               label="Farbe"
               type="color"
               control={form.control}
            />

            <Button type="submit" disabled={isSaving} className="w-full">
               {isSaving ? (
                  <>
                     <Loader className="mr-1.5 h-4 w-4 animate-spin" />
                     Speichern...
                  </>
               ) : (
                  "Änderungen speichern"
               )}
            </Button>
         </form>

         {/* Sharing Section */}
         <div className="mt-6 space-y-3 border-t pt-6">
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
         </div>
      </Form>
   );
};
