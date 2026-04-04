"use client";

import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DCollection } from "@/data/types/domain/collection";
import { CollectionBreadcrumb } from "../../breadcrumbs";
import { CollectionEditForm, CreateCollectionForm } from "..";

import { CollectionTemplateManager } from "./collection-template-manager";

type Props = {
   collection?: DCollection;
};

export const CollectionEdit = ({ collection }: Props) => {
   const isEdit = !!collection;

   const title = isEdit ? "Sammlung Bearbeiten" : "Neue Sammlung Erstellen";
   const subtitle = isEdit
      ? "Bearbeiten Sie die Details und Vorlagen der Sammlung"
      : "Erstellen Sie eine neue Sammlung";

   return (
      <ItemDetailsEdit data-testid="collection-edit">
         <ItemDetailsEditHeader>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
         </ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBreadcrumbs>
               {isEdit ? (
                  <CollectionBreadcrumb
                     variant="edit"
                     label={collection.name}
                     collectionId={collection.id}
                  />
               ) : (
                  <CollectionBreadcrumb variant="new" />
               )}
            </ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>
               {isEdit ? (
                  <div className="grid grid-cols-1 gap-6 px-6 pb-8 lg:grid-cols-[340px_1fr]">
                     <CollectionEditForm collection={collection} />
                     {/* <CollectionTemplateManager collectionId={collection.id} /> */}
                  </div>
               ) : (
                  <div className="px-6 pb-8">
                     <div className="mx-auto max-w-md">
                        <CreateCollectionForm />
                     </div>
                  </div>
               )}
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
