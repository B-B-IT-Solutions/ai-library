import { DPrompt, DPromptWithContent } from "@/data/types/domain/prompt";
import { TemplateBreadcrumb } from "../../breadcrumbs";
import {
   DeleteTemplateButton,
   DownloadTemplateButton,
   EditTemplateButton,
   UseTemplateButton,
} from "../../buttons";

import { TemplateViewForm } from "./template-view-form";

type Props = {
   descriptor: DPrompt;
   template: DPromptWithContent;
};

export const TemplateView = ({ descriptor, template }: Props) => {
   return (
      <div
         className="flex h-full flex-col bg-slate-50"
         data-testid="template-view"
      >
         {/* Sticky topbar */}
         <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-6">
            <TemplateBreadcrumb variant="view" label={descriptor.title} />
         </div>

         {/* Scrollable content */}
         <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-8">
               <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
                  {/* Main content */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <TemplateViewForm
                        descriptor={descriptor}
                        template={template}
                     />
                  </div>

                  {/* Sidebar */}
                  <aside className="space-y-3 lg:sticky lg:top-8 lg:self-start">
                     <UseTemplateButton
                        descriptor={descriptor}
                        className="w-full justify-center py-5 text-sm"
                     />
                     <div className="space-y-1 pt-1">
                        <EditTemplateButton
                           descriptor={descriptor}
                           className="w-full cursor-pointer justify-start"
                        />
                        <DownloadTemplateButton
                           descriptor={descriptor}
                           className="w-full cursor-pointer justify-start"
                        />
                        <DeleteTemplateButton
                           descriptor={descriptor}
                           asButton
                        />
                     </div>
                     <div className="border-t border-slate-200 pt-4">
                        <p className="mb-2 text-xs font-medium text-slate-400">
                           Empfohlenes Modell
                        </p>
                        <div className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                           {descriptor.recommendedModel}
                        </div>
                     </div>
                  </aside>
               </div>
            </div>
         </div>
      </div>
   );
};
