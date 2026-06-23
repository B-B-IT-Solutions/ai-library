import { ReactNode } from "react";

import { isAuthenticated } from "@/data/actions/auth-utils";

import { Footer } from "./footer";
import { Header } from "./header";

export type Props = {
   children: ReactNode;
};

export const PublicLayoutWrapper = async ({ children }: Props) => {
   const authenticated = await isAuthenticated();

   return (
      <div
         className="flex min-h-screen flex-col bg-background"
         data-testid="public-layout-wrapper"
      >
         <Header authenticated={authenticated} />

         <main className="flex-1">{children}</main>

         <Footer />
      </div>
   );
};
