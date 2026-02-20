import { FC } from "react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TsQueryClientProvider } from "./ts-query-client/provider";

type ProvidersProps = {
   children: React.ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ children }) => {
   return (
      <TsQueryClientProvider>
         <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange={true}
         >
            <NuqsAdapter>{children}</NuqsAdapter>
         </ThemeProvider>
      </TsQueryClientProvider>
   );
};
