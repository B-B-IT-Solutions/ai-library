import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ "data-testid"?: string }>;

const ItemDetailsView = ({ children, "data-testid": testId }: Props) => {
   return (
      <div className="flex h-screen flex-col bg-slate-50" data-testid={testId}>
         {children}
      </div>
   );
};

const ItemDetailsViewHeader = ({ children, "data-testid": testId }: Props) => {
   return (
      <div
         className="border-b border-slate-200 bg-white px-6 py-5"
         data-testid={testId}
      >
         {children}
      </div>
   );
};

const ItemDetailsViewContent = ({ children, "data-testid": testId }: Props) => {
   return (
      <div className="flex-1 overflow-y-auto" data-testid={testId}>
         {children}
      </div>
   );
};

const ItemDetailsViewBreadcrumbs = ({
   children,
   "data-testid": testId,
}: Props) => {
   return (
      <div className="px-6 pt-3 pb-3.5" data-testid={testId}>
         {children}
      </div>
   );
};

const ItemDetailsViewBody = ({ children, "data-testid": testId }: Props) => {
   return (
      <div className="mx-auto max-w-5xl" data-testid={testId}>
         {children}
      </div>
   );
};

export {
   ItemDetailsView,
   ItemDetailsViewHeader,
   ItemDetailsViewContent,
   ItemDetailsViewBreadcrumbs,
   ItemDetailsViewBody,
};
