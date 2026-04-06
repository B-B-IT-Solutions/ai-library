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
               <TabsList>
                  <TabsTrigger value="general">Einstellungen</TabsTrigger>
                  <TabsTrigger value="templates">Vorlagen</TabsTrigger>
                  <TabsTrigger value="sharing">Freigabe</TabsTrigger>
               </TabsList>
               <TabsContent value="general">
                  <CollectionEditForm collection={collection} />
               </TabsContent>
               <TabsContent value="templates">
                  <CollectionTemplates collectionId={collection.id} />
               </TabsContent>
               <TabsContent value="sharing">
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
