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
import { CollectionTemplateManager } from "./collection-template-manager";

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

   const form = () => {
      if (isEdit) {
         return (
            <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-[340px_1fr]">
               <CollectionEditForm collection={collection} />
               <CollectionTemplateManager collectionId={collection.id} />
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
               <CollectionBreadcrumb variant="new" />
            </ItemDetailsEditBreadcrumbs>
            <ItemDetailsEditBody>{form()}</ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
