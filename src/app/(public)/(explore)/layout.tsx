import { ReactNode } from "react";

import { PublicLayoutWrapper } from "@/components/shared/wrappers/layout";

export type LayoutProps = {
   children: ReactNode;
};

export const PublicLayout = ({ children }: LayoutProps) => {
   return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
};

export default PublicLayout;
