"use client";

import { ReactNode, useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { TemplateBreadcrumb } from "../../breadcrumbs";

import { TemplateEditForm } from "./template-edit-form";

type Props = {
   prompt?: DPromptWithContent;
   collectionId?: string;
   globalFields: DGlobalPromptField[];
};

export const TemplateEdit = ({ prompt, collectionId, globalFields }: Props) => {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const isEdit = !!prompt;

   const cancelHref = isEdit
      ? `/templates/${prompt!.id}`
      : collectionId
        ? `/collections/${collectionId}`
        : "/templates";

   const breadcrumbs = (): ReactNode => {
      if (prompt) {
         return (
            <TemplateBreadcrumb
               variant="edit"
               label={prompt.title}
               entryId={prompt.id}
            />
         );
      }
      return <TemplateBreadcrumb variant="new" />;
   };

   const actions = (): ReactNode => {
      return (
         <div className="flex items-center gap-2">
            <Button
               asChild
               type="button"
               variant="outline"
               disabled={isSubmitting}
               className="cursor-pointer"
            >
               <Link href={cancelHref}>Abbrechen</Link>
            </Button>
            <Button
               type="submit"
               form="template-edit-form"
               disabled={isSubmitting}
               className="cursor-pointer"
            >
               {isSubmitting ? (
                  <>
                     <Loader className="h-4 w-4 animate-spin" />
                     {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
                  </>
               ) : (
                  <>{isEdit ? "Prompt speichern" : "Prompt erstellen"}</>
               )}
            </Button>
         </div>
      );
   };

   return (
      <ItemDetailsEdit data-testid="template-edit">
         <ItemDetailsEditHeader>
            <div className="flex items-center justify-between">
               {breadcrumbs()}
               {actions()}
            </div>
         </ItemDetailsEditHeader>
         <ItemDetailsEditContent>
            <ItemDetailsEditBody>
               <TemplateEditForm
                  prompt={prompt}
                  collectionId={collectionId}
                  globalFields={globalFields}
                  onSubmittingChange={setIsSubmitting}
               />
            </ItemDetailsEditBody>
         </ItemDetailsEditContent>
      </ItemDetailsEdit>
   );
};
