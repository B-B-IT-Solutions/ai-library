import { ReactNode } from "react";

import { PublicLayoutWrapper } from "@/components/shared/wrappers";

export type Props = {
   children: ReactNode;
};

export const PublicLayout = (props: Readonly<Props>) => {
   const { children } = props;
   return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
};

export default PublicLayout;
