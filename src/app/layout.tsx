import "@/assets/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/shadcn/sonner";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Providers } from "@/providers";

const inter = Inter({
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: {
      template: `%s | ${APP_NAME}`,
      default: APP_NAME,
   },
   description: APP_DESCRIPTION,
};

export type RootLayoutProps = {
   children: React.ReactNode;
};

const RootLayout = (props: Readonly<RootLayoutProps>) => {
   const { children } = props;
   return (
      <html lang="de" suppressHydrationWarning={true}>
         <body
            className={`${inter.className} h-screen antialiased`}
            data-testid="root-layout"
         >
            <Providers>
               <Toaster />
               {children}
            </Providers>
         </body>
      </html>
   );
};

export default RootLayout;
