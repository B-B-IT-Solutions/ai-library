import { ReactNode } from "react";

import { AuthenticatedUserLayoutWrapper } from "@/components/shared/wrappers/layout";

export type LayoutProps = {
   children: ReactNode;
};

const MainLayout = async (props: Readonly<LayoutProps>) => {
   const { children } = props;
   return (
      <AuthenticatedUserLayoutWrapper>
         {children}
      </AuthenticatedUserLayoutWrapper>
   );
};

export default MainLayout;
