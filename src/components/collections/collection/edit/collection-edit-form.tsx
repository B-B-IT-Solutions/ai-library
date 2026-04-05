"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Globe, Loader, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Form } from "@/components/shadcn/form";
import { FormInput, FormTextArea } from "@/components/shared/widgets";
import {
   useCreateCollection,
   useSetCollectionSharing,
   useUpdateCollection,
} from "@/data/ts-queries/library";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { updateCollectionSchema } from "@/data/types/validators/collection";

import { initCollection } from "./utils";

type Props = {
   collection?: DCollection;
};

export const CollectionEditForm = ({ collection }: Props) => {
   const router = useRouter();
   const isEdit = !!collection;

   const { mutate: updateCollection, isPending: isUpdating } =
      useUpdateCollection();
   const { mutate: createCollection, isPending: isCreating } =
      useCreateCollection();

   const { mutate: setSharing, isPending: isTogglingShare } =
      useSetCollectionSharing();
   const [copied, setCopied] = useState(false);

   const form = useForm<DCollectionUpdate>({
      resolver: zodResolver(updateCollectionSchema),
      defaultValues: initCollection(collection),
   });

   const isSubmitting = isUpdating || isCreating;

   const shareUrl =
      typeof window !== "undefined" && collection?.shareToken
         ? `${window.location.origin}/p/collections/${collection.shareToken}`
         : null;

   const onSubmit = (data: DCollectionUpdate) => {
      if (isEdit) {
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
      } else {
         createCollection(data, {
            onSuccess: (result) => {
               if (result.success && result.data) {
                  toast.success(result.message);
                  // if (onCreated) {
                  //    onCreated(result.data.id);
                  // } else {
                  router.push(`/collections/${result.data.id}`);
                  // }
               } else {
                  toast.error(result.message);
               }
            },
            onError: () => {
               toast.error("Fehler beim Erstellen der Sammlung");
            },
         });
      }
   };

   const handleToggleShare = () => {
      if (isEdit) {
         setSharing(
            { collectionId: collection.id, isPublic: !collection.isPublic },
            {
               onSuccess: (result) => {
                  if (!result.success) toast.error(result.message);
               },
            }
         );
      }
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

   const cancelBtn = () => {
      return (
         <Link href={isEdit ? `/collections/${collection.id}` : "/collections"}>
            <Button
               type="button"
               variant="outline"
               disabled={isSubmitting}
               className="cursor-pointer"
               data-testid="cancel-btn"
            >
               Abbrechen
            </Button>
         </Link>
      );
   };

   const submitBtn = () => {
      return (
         <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid={"save-btn"}
         >
            {isSubmitting ? (
               <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
               </>
            ) : isEdit ? (
               "Sammlung speichern"
            ) : (
               "Sammlung erstellen"
            )}
         </Button>
      );
   };

   const buttons = () => {
      return (
         <div className="flex items-center justify-end gap-3 pt-2">
            {cancelBtn()}
            {submitBtn()}
         </div>
      );
   };

   return (
      <Card data-testid="collection-edit-form">
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
               >
                  <FormInput<DCollectionUpdate>
                     name="name"
                     label="Name"
                     required={true}
                     control={form.control}
                  />
                  <FormTextArea<DCollectionUpdate>
                     name="description"
                     label="Beschreibung"
                     placeholder="Wofür wird diese Sammlung verwendet?"
                     control={form.control}
                  />
                  <FormInput<DCollectionUpdate>
                     name="color"
                     label="Farbe"
                     type="color"
                     control={form.control}
                  />
                  {buttons()}
               </form>

               {/* Sharing Section */}
               <div className="mt-6 space-y-3 border-t pt-6">
                  <p className="text-sm font-semibold text-slate-700">
                     Freigabe
                  </p>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                     <div className="flex items-center gap-2.5">
                        {collection?.isPublic ? (
                           <Globe className="h-4 w-4 text-green-600" />
                        ) : (
                           <Lock className="h-4 w-4 text-slate-400" />
                        )}
                        <div>
                           <p className="text-sm font-medium">
                              {collection?.isPublic ? "Öffentlich" : "Privat"}
                           </p>
                           <p className="text-xs text-slate-500">
                              {collection?.isPublic
                                 ? "Jeder mit Link kann ansehen"
                                 : "Nur für Sie sichtbar"}
                           </p>
                        </div>
                     </div>
                     <Button
                        type="button"
                        variant={
                           collection?.isPublic ? "destructive" : "outline"
                        }
                        size="sm"
                        onClick={handleToggleShare}
                        disabled={isTogglingShare}
                     >
                        {isTogglingShare ? (
                           <Loader className="h-4 w-4 animate-spin" />
                        ) : collection?.isPublic ? (
                           "Deaktivieren"
                        ) : (
                           "Aktivieren"
                        )}
                     </Button>
                  </div>

                  {collection?.isPublic && shareUrl && (
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
         </CardContent>
      </Card>
   );
};
