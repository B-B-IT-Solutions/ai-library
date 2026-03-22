import { ReactNode } from "react";

type Props = {
   header: ReactNode;
   breadcrumbs: ReactNode;
   children: ReactNode;
};

export const ItemDetailsView = ({ header, breadcrumbs, children }: Props) => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="library-entry-view"
      >
         <div className="border-b border-slate-200 bg-white px-6 py-5">
            {header}
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-3 pb-3.5">{breadcrumbs}</div>
            <div className="mx-auto max-w-5xl">{children}</div>
         </div>
      </div>
   );
};
