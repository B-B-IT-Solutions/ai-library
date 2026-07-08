import { ReactNode } from "react";

export type LayoutProps = {
   children: ReactNode;
};

const KiReadinessLayout = ({ children }: LayoutProps) => {
   return (
      <div
         className="min-h-screen bg-slate-50"
         data-testid="ki-readiness-layout"
      >
         {children}
      </div>
   );
};

export default KiReadinessLayout;
