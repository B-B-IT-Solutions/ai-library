import { BreadcrumbLinkProps } from "@/components/shared/breadcrumbs";
import { DCollection } from "@/data/types/domain/collection";
import { DPromptWithContent } from "@/data/types/domain/prompt";
import { PromptBreadcrumb } from "../../breadcrumbs";

import { PromptForm } from "./form";
import { PromptSidebarPublic } from "./sidebar";

type Props = {
   prompt: DPromptWithContent;
   collection?: DCollection;
};

export const PublicPromptView = ({ prompt, collection }: Props) => {
   const isCollection = !!collection?.publicToken;

   const breadcrumbRoot: BreadcrumbLinkProps = {
      href: isCollection
         ? `/preview/collections/${collection.publicToken}`
         : "/preview/marketplace",
      label: isCollection ? collection.name : "Bibliothek",
   };

   return (
      <div
         className="flex h-full flex-col bg-slate-50"
         data-testid="public-prompt-view"
      >
         {/* Page header */}
         <div className="border-b bg-white">
            <div className="mx-auto max-w-7xl py-4">
               <PromptBreadcrumb
                  variant="view"
                  label={prompt.title}
                  root={breadcrumbRoot}
               />
            </div>
         </div>

         {/* Scrollable content */}
         <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-8">
               <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
                  {/* Main content */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <PromptForm prompt={prompt} />
                  </div>

                  {/* Sidebar */}
                  <PromptSidebarPublic prompt={prompt} />
               </div>
            </div>
         </div>
      </div>
   );
};
