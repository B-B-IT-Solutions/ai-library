import { ReactNode } from "react";

import { PublicLayoutWrapper } from "@/components/shared/wrappers/layout";

type LayoutProps = {
   children: ReactNode;
};

export const ExploreLayout = async ({ children }: LayoutProps) => {
   return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
};

export default ExploreLayout;
