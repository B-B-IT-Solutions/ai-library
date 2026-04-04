"use client";

import { useState } from "react";
import { Check, Folder } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DCollection } from "@/data/types/domain/collection";
import { CollectionBreadcrumb } from "../../breadcrumbs";
import { CollectionTemplateManager } from "../../collection-template-manager";
import { CreateCollectionForm } from "..";

type Props = {
   collection?: DCollection;
};

export const CollectionEdit = ({ collection }: Props) => {
   const router = useRouter();
   const [createdId, setCreatedId] = useState<string | null>(null);

   const header = () => {
      const title = collection
         ? "Sammlung Bearbeiten"
         : "  Neue Sammlung Erstellen";
      const text = collection
         ? "Bearbeiten Sie die Sammlung"
         : "Erstellen Sie eine neue Sammlung";

      return (
         <>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{text}</p>
         </>
      );
   };

   return (
      <ItemDetailsEdit data-testid="collection-edit">
         <ItemDetailsEditHeader>{header()}</ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBreadcrumbs>
               <CollectionBreadcrumb variant="new" />
            </ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>
               <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-[340px_1fr]">
                  {/* Left: Form or success state */}
                  <div>
                     {createdId ? (
                        <Card>
                           <CardContent>
                              <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
                                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                    <Check className="h-6 w-6 text-green-600" />
                                 </div>
                                 <div>
                                    <h3 className="font-semibold text-slate-900">
                                       Sammlung erstellt!
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                       Fügen Sie jetzt Vorlagen hinzu oder
                                       besuchen Sie die Sammlung.
                                    </p>
                                 </div>
                                 <div className="flex w-full flex-col gap-2">
                                    <Button
                                       onClick={() =>
                                          router.push(
                                             `/collections/${createdId}`
                                          )
                                       }
                                    >
                                       Zur Sammlung
                                    </Button>
                                    <Button
                                       variant="outline"
                                       onClick={() =>
                                          router.push(
                                             `/collections/${createdId}/edit`
                                          )
                                       }
                                    >
                                       Sammlung bearbeiten
                                    </Button>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ) : (
                        <Card>
                           <CardContent>
                              <h2 className="mb-4 font-semibold text-slate-800">
                                 Sammlung
                              </h2>
                              <CreateCollectionForm onCreated={setCreatedId} />
                           </CardContent>
                        </Card>
                     )}
                  </div>

                  {/* Right: Template manager */}
                  <Card>
                     <CardContent>
                        <h2 className="mb-4 font-semibold text-slate-800">
                           Vorlagen
                        </h2>
                        {createdId ? (
                           <CollectionTemplateManager
                              collectionId={createdId}
                           />
                        ) : (
                           <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-slate-400">
                              <Folder className="mb-3 h-8 w-8 text-slate-300" />
                              <p>Erstellen Sie zuerst die Sammlung,</p>
                              <p>um Vorlagen hinzuzufügen.</p>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
