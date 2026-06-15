import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type Props = PropsWithChildren<{ "data-testid"?: string; className?: string }>;

const ItemDetailsEdit = ({ children, "data-testid": testId }: Props) => {
   return (
      <div className="flex h-full flex-col bg-slate-50" data-testid={testId}>
         {children}
      </div>
   );
};

const ItemDetailsEditHeader = ({ children, "data-testid": testId }: Props) => {
   return (
      <div
         className="sticky top-0 z-40 flex shrink-0 items-center border-b border-slate-200 bg-white px-6 py-3"
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

const ItemDetailsEditBody = ({
   children,
   className,
   "data-testid": testId,
}: Props) => {
   return (
      <div
         className={cn("mx-auto max-w-5xl px-6 py-8", className)}
         data-testid={testId}
      >
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
