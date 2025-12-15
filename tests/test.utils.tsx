import { JSX } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
   render,
   renderHook,
   RenderHookResult,
   RenderResult,
   waitFor,
} from "@testing-library/react";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider/next-13.5";

import { SidebarProvider } from "@/components/shadcn/sidebar";

export const renderAsyncRSC = async <T,>(
   asyncComponent: (props: T) => Promise<JSX.Element>,
   props: T
) => {
   const component = await asyncComponent(props);
   let result: RenderResult = {} as RenderResult;
   const queryClient = testQueryClient();

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

export const renderWithReactQuery = (component: React.ReactNode) => {
   const queryClient = testQueryClient();
   return {
      ...render(
         <QueryClientProvider client={queryClient}>
            {component}
         </QueryClientProvider>
      ),
   };
};

export const renderWithRouter = (
   component: React.ReactNode,
   url: string = "/"
) => {
   const queryClient = testQueryClient();
   mockRouter.push(url);
   return {
      ...render(
         <QueryClientProvider client={queryClient}>
            <MemoryRouterProvider url={url}>{component}</MemoryRouterProvider>
         </QueryClientProvider>
      ),
   };
};

export const renderWithSidebar = (
   component: React.ReactNode,
   url: string = "/",
   open: boolean = true
) => {
   const queryClient = testQueryClient();
   mockRouter.push(url);
   return {
      ...render(
         <QueryClientProvider client={queryClient}>
            <MemoryRouterProvider url={url}>
               <SidebarProvider defaultOpen={open}>{component}</SidebarProvider>
            </MemoryRouterProvider>
         </QueryClientProvider>
      ),
   };
};

export const renderHookWithReactQuery = <Result, Props>(
   hookUnderTest: () => Result
): RenderHookResult<Result, Props> => {
   const queryClient = testQueryClient();
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

const testQueryClient = () => {
   return new QueryClient({
      defaultOptions: {
         queries: {
            retry: false,
         },
      },
   });
};
