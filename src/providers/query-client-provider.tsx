"use client";

import { FC } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "@/providers/get-query-client";

type QueryClientProviderProps = {
   children: React.ReactNode;
};

export const TsQueryClientProvider: FC<QueryClientProviderProps> = ({
   children,
}) => {
   const queryClient = getQueryClient();

   return (
      <QueryClientProvider client={queryClient}>
         {children}
         <ReactQueryDevtools buttonPosition="bottom-left" />
      </QueryClientProvider>
   );
};
