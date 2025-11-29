import { FC } from "react";
import { ThemeProvider } from "next-themes";

import { TsQueryClientProvider } from "./query-client-provider";

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
            {children}
         </ThemeProvider>
      </TsQueryClientProvider>
   );
};
