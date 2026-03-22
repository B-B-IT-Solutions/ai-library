import { ReactNode } from "react";

import { AuthenticatedLayoutWrapper } from "@/components/shared/wrappers/layout";

export type MainLayoutProps = {
   children: ReactNode;
};

const MainLayout = async (props: Readonly<MainLayoutProps>) => {
   const { children } = props;
   return <AuthenticatedLayoutWrapper>{children}</AuthenticatedLayoutWrapper>;
};

export default MainLayout;
