import { BreadcrumbLinkProps } from "@/components/shared/breadcrumbs";
import { DCollection } from "@/data/types/domain/collection";
import { DPromptWithContent } from "@/data/types/domain/prompt";
import { PromptBreadcrumb } from "../../breadcrumbs";

import { PromptForm } from "./form";
import { PromptSidebar } from "./sidebar";

type Props = {
   prompt: DPromptWithContent;
   collection?: DCollection | null;
};

export const PromptView = ({ prompt, collection }: Props) => {
   const collectionRoot: BreadcrumbLinkProps | undefined = collection
      ? {
           label: collection.name,
           href: `/collections/${collection.id}`,
        }
      : undefined;

   return (
      <div
         className="flex h-full flex-col bg-slate-50"
         data-testid="prompt-view"
      >
         {/* Sticky topbar */}
         <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-6">
            <PromptBreadcrumb
               variant="view"
               label={prompt.title}
               root={collectionRoot}
            />
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
                  <PromptSidebar prompt={prompt} collection={collection} />
               </div>
            </div>
         </div>
      </div>
   );
};
