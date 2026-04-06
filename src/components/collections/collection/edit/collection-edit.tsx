"use client";

import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/shadcn/tabs";
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
import { CollectionSharing } from "./collection-sharing";
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

   const body = () => {
      if (isEdit) {
         return (
            <Tabs defaultValue="general" orientation="horizontal">
               <TabsList variant="default" className="w-full bg-slate-50">
                  <TabsTrigger value="general" className="bg-slate-50">
                     Einstellungen
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="bg-slate-50">
                     Vorlagen
                  </TabsTrigger>
                  <TabsTrigger value="sharing" className="bg-slate-50">
                     Freigabe
                  </TabsTrigger>
               </TabsList>
               <TabsContent value="general" className="pb-6">
                  <CollectionEditForm collection={collection} />
               </TabsContent>
               <TabsContent value="templates" className="pb-6">
                  <CollectionTemplates collectionId={collection.id} />
               </TabsContent>
               <TabsContent value="sharing" className="pb-6">
                  <CollectionSharing collection={collection} />
               </TabsContent>
            </Tabs>
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
            <ItemDetailsEditBody>{body()}</ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
