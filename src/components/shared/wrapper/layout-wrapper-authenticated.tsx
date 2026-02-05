import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/data/actions/auth-utils";

export type Props = {
   children: ReactNode;
};

export const AuthenticatedLayoutWrapper = async (props: Props) => {
   const { children } = props;

   const authenticated = await isAuthenticated();
   if (!authenticated) {
      return redirect("/auth/sign-in");
   }

   return <div data-testid="authenticated-layout-wrapper">{children}</div>;
};
