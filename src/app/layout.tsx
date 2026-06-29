import "@/assets/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/shadcn/sonner";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Providers } from "@/providers";

const inter = Inter({
   subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
   const appUrl = "https://app.vision-notes.com";
   return {
      title: {
         template: `%s | ${APP_NAME}`,
         default: APP_NAME,
      },
      description: APP_DESCRIPTION,
      metadataBase: new URL(appUrl),
      alternates: {
         canonical: "/",
         languages: {
            "de-DE": "/de-DE",
         },
      },
   };
}

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
