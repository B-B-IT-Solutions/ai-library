import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ "data-testid"?: string }>;

const ItemDetailsEdit = ({ children, "data-testid": testId }: Props) => {
   return (
      <div className="flex h-screen flex-col bg-slate-50" data-testid={testId}>
         {children}
      </div>
   );
};

const ItemDetailsEditHeader = ({ children, "data-testid": testId }: Props) => {
   return (
      <div
         className="border-b border-slate-200 bg-white px-6 py-4"
         data-testid={testId}
      >
         {children}
      </div>
   );
};

const ItemDetailsEditContent = ({ children, "data-testid": testId }: Props) => {
   return (
      <div className="flex-1 overflow-y-auto" data-testid={testId}>
         {children}
      </div>
   );
};

const ItemDetailsEditBreadcrumbs = ({
   children,
   "data-testid": testId,
}: Props) => {
   return (
      <div className="px-6 pt-3 pb-3.5" data-testid={testId}>
         {children}
      </div>
   );
};

const ItemDetailsEditBody = ({ children, "data-testid": testId }: Props) => {
   return (
      <div className="mx-auto max-w-5xl" data-testid={testId}>
         {children}
      </div>
   );
};

export {
   ItemDetailsEdit,
   ItemDetailsEditHeader,
   ItemDetailsEditContent,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditBody,
};
