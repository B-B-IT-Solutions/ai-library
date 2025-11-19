import "@/assets/styles/globals.css";

import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {ThemeProvider} from "next-themes";

import {Toaster} from "@/components/shadcn/sonner";
import {APP_DESCRIPTION, APP_NAME, SERVER_URL} from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = (props: Readonly<RootLayoutProps>) => {
  const {children} = props;
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.className} antialiased`} data-testid="root-layout">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
