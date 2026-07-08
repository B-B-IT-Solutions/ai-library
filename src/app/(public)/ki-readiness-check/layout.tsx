import type { ReactNode } from "react";

interface KiReadinessLayoutProps {
   children: ReactNode;
}

const KiReadinessLayout = ({ children }: KiReadinessLayoutProps) => {
   return (
      <div className="min-h-screen bg-slate-50" data-testid="ki-readiness-layout">
         {children}
      </div>
   );
};

export default KiReadinessLayout;
