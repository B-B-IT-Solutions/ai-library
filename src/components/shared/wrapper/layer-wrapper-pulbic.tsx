import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/data/actions/auth-utils";

export type Props = {
   children: ReactNode;
};

export const PublicLayoutWrapper = async (props: Props) => {
   const { children } = props;

   const authenticated = await isAuthenticated();
   if (authenticated) {
      return redirect("/");
   }

   return <div data-testid="public-layout-wrapper">{children}</div>;
};
