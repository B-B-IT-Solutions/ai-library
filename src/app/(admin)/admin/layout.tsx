import { ReactNode } from "react";

import { AuthenticatedAdminLayoutWrapper } from "@/components/shared/wrappers/layout";

export type LayoutProps = {
   children: ReactNode;
};

export const MainAdminLayout = async (props: Readonly<LayoutProps>) => {
   const { children } = props;

   return (
      <AuthenticatedAdminLayoutWrapper>
         {children}
      </AuthenticatedAdminLayoutWrapper>
   );
};

export default MainAdminLayout;
