"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/shadcn/tabs";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DCollection } from "@/data/types/domain/collection";
import { CollectionBreadcrumb } from "../../breadcrumbs";

import {
   CollectionEditForm,
   CollectionOther,
   CollectionPrompts,
} from "./sections";

type Props = {
   collection?: DCollection;
};

export const CollectionEdit = ({ collection }: Props) => {
   const isEdit = !!collection;
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [activeTab, setActiveTab] = useState("general");

   const cancelUrl = isEdit ? `/collections/${collection.id}` : "/collections";

   const formId = "collection-edit-form";

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

   const actions = () => (
      <div className="flex items-center gap-2">
         <Button
            asChild={true}
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid="cancel-btn"
         >
            <Link href={cancelUrl}>Abbrechen</Link>
         </Button>
         {activeTab === "general" && (
            <Button
               type="submit"
               form={formId}
               disabled={isSubmitting}
               className="cursor-pointer bg-blue-700 hover:bg-blue-800"
               data-testid="save-btn"
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
         )}
      </div>
   );

   const body = () => (
      <Tabs
         value={activeTab}
         onValueChange={setActiveTab}
         orientation="horizontal"
      >
         <TabsList className="mb-6 h-auto w-full gap-0 rounded-none border-b border-slate-200 bg-transparent p-0">
            <TabsTrigger
               value="general"
               className="rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
               data-testid="tab-general-btn"
            >
               Einstellungen
            </TabsTrigger>
            <TabsTrigger
               value="templates"
               disabled={!isEdit}
               className="rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none disabled:cursor-not-allowed disabled:opacity-40 data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
               data-testid="tab-templates-btn"
            >
               Vorlagen
            </TabsTrigger>
            <TabsTrigger
               value="other"
               disabled={!isEdit}
               className="rounded-none border-b border-transparent px-4 py-2.5 text-sm shadow-none disabled:cursor-not-allowed disabled:opacity-40 data-[state=active]:rounded-t-sm data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
               data-testid="tab-other-btn"
            >
               Freigabe
            </TabsTrigger>
         </TabsList>
         <TabsContent value="general">
            <CollectionEditForm
               collection={collection}
               onSubmittingChange={setIsSubmitting}
               formId={formId}
            />
         </TabsContent>
         {isEdit && (
            <>
               <TabsContent value="templates">
                  <CollectionPrompts collectionId={collection.id} />
               </TabsContent>
               <TabsContent value="other">
                  <CollectionOther collection={collection} />
               </TabsContent>
            </>
         )}
      </Tabs>
   );

   return (
      <ItemDetailsEdit data-testid="collection-edit">
         <ItemDetailsEditHeader>
            {breadcrumbs()}
            <div
               className="ml-auto hidden lg:flex"
               data-testid="header-actions"
            >
               {actions()}
            </div>
         </ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBody>{body()}</ItemDetailsEditBody>
         </ItemDetailsEditContent>
         <div
            className="flex justify-end border-t border-slate-200 bg-white px-6 py-3 lg:hidden"
            data-testid="footer-actions"
         >
            {actions()}
         </div>
      </ItemDetailsEdit>
   );
};
