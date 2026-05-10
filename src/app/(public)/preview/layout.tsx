import { ReactNode } from "react";

import { PublicLayoutWrapper } from "@/components/shared/wrappers/layout";

export type LayoutProps = {
   children: ReactNode;
};

const PreviewLayout = async (props: Readonly<LayoutProps>) => {
   const { children } = props;
   return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
};

export default PreviewLayout;
