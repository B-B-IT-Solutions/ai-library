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

import { CollectionEditForm } from "./collection-edit-form";
import { CollectionTemplates } from "./collection-templates";

type Props = {
   collection?: DCollection;
};

export const CollectionEdit = ({ collection }: Props) => {
   const isEdit = !!collection;

   const header = () => {
      const title = isEdit ? "Sammlung Bearbeiten" : "Neue Sammlung Erstellen";
      const text = isEdit
         ? "Bearbeiten Sie die Details und Vorlagen der Sammlung"
         : "Erstellen Sie eine neue Sammlung";

      return (
         <>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{text}</p>
         </>
      );
   };

   const breadcrumbs = () => {
      if (isEdit) {
         return (
            <CollectionBreadcrumb
               variant="edit"
               label={collection.name}
               collectionId={collection.id}
            />
         );
      }
      return <CollectionBreadcrumb variant="new" />;
   };

   const form = () => {
      if (isEdit) {
         return (
            <div className="flex flex-col gap-8">
               <CollectionEditForm collection={collection} />
               <CollectionTemplates collectionId={collection.id} />
            </div>
         );
      }
      return <CollectionEditForm collection={collection} />;
   };

   return (
      <ItemDetailsEdit data-testid="collection-edit">
         <ItemDetailsEditHeader>{header()}</ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBreadcrumbs>
               {breadcrumbs()}
            </ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>{form()}</ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
