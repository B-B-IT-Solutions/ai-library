import { JSX } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
   render,
   renderHook,
   RenderHookResult,
   RenderResult,
   waitFor,
} from "@testing-library/react";

export const renderAsyncRSC = async <T,>(
   asyncComponent: (props: T) => Promise<JSX.Element>,
   props: T
) => {
   const component = await asyncComponent(props);
   let result: RenderResult = {} as RenderResult;
   const queryClient = new QueryClient({
      defaultOptions: {
         queries: {
            retry: false,
         },
      },
   });

   await waitFor(() => {
      result = render(
         <QueryClientProvider client={queryClient}>
            {component}
         </QueryClientProvider>
      );
   });

   return {
      ...result,
   };
};

export const renderHookWithReactQuery = <Result, Props>(
   hookUnderTest: () => Result
): RenderHookResult<Result, Props> => {
   const queryClient = new QueryClient({
      defaultOptions: {
         queries: {
            retry: false,
         },
      },
   });

   const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );

   return {
      ...renderHook(() => hookUnderTest(), { wrapper }),
   };
};

export const getElementById = (id: string): HTMLElement => {
   return document.getElementById(id) as HTMLElement;
};
