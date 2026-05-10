import { ReactNode } from "react";

export type Props = {
   children: ReactNode;
};

export const PublicLayoutWrapper = ({ children }: Props) => {
   return (
      <div className="h-full" data-testid="public-layout-wrapper">
         {children}
      </div>
   );
};
