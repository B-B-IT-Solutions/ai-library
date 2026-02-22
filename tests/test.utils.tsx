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
import {
   NuqsTestingAdapter,
   type OnUrlUpdateFunction,
   withNuqsTestingAdapter,
} from "nuqs/adapters/testing";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import { TooltipProvider } from "@/components/shadcn/tooltip";

const withRSCWrapper = (searchParams?: string) => {
   const queryClient = testQueryClient();

   const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return (
         <QueryClientProvider client={queryClient}>
            <NuqsTestingAdapter
               searchParams={`?${searchParams}`}
               defaultOptions={{
                  shallow: false,
               }}
            >
               {children}
            </NuqsTestingAdapter>
         </QueryClientProvider>
      );
   };
   return Wrapper;
};

export const resolveRSC = async <T,>(
   rsc: (props: T) => Promise<JSX.Element>,
   props: T
) => {
   return rsc(props);
};

export const renderRSC = (
   component: React.ReactNode,
   searchParams?: string
) => {
   return render(component, {
      wrapper: withRSCWrapper(searchParams),
   });
};

export const renderAsyncRSC = async <T,>(
   asyncComponent: (props: T) => Promise<JSX.Element>,
   props: T,
   searchParams?: string
) => {
   const component = await asyncComponent(props);
   let result: RenderResult = {} as RenderResult;
   const queryClient = testQueryClient();

   await waitFor(() => {
      result = render(
         <QueryClientProvider client={queryClient}>
            <NuqsTestingAdapter
               searchParams={`?${searchParams}`}
               defaultOptions={{
                  shallow: false,
               }}
            >
               {component}
            </NuqsTestingAdapter>
         </QueryClientProvider>
      );
   });

   return {
      ...result,
   };
};

export const renderWithReactQuery = (component: React.ReactNode) => {
   const queryClient = testQueryClient();
   const { rerender: origRerender, ...rest } = render(
      <QueryClientProvider client={queryClient}>
         {component}
      </QueryClientProvider>
   );
   return {
      ...rest,
      rerender: (component: JSX.Element) => {
         return origRerender(
            <QueryClientProvider client={queryClient}>
               {component}
            </QueryClientProvider>
         );
      },
   };
};

export const renderWithTooltip = (component: React.ReactNode) => {
   const queryClient = testQueryClient();
   return {
      ...render(
         <QueryClientProvider client={queryClient}>
            <TooltipProvider>{component}</TooltipProvider>
         </QueryClientProvider>
      ),
   };
};

export const renderWithRouter = (
   component: React.ReactNode,
   url: string = "/",
   searchParams?: string,
   onNuqsUrlUpdate?: OnUrlUpdateFunction
) => {
   const queryClient = testQueryClient();
   mockRouter.push(url);
   return {
      ...render(
         <QueryClientProvider client={queryClient}>
            <MemoryRouterProvider url={url}>
               <TooltipProvider>{component}</TooltipProvider>
            </MemoryRouterProvider>
         </QueryClientProvider>,
         {
            wrapper: withNuqsTestingAdapter({
               searchParams: `?${searchParams}`,
               onUrlUpdate: onNuqsUrlUpdate,
               defaultOptions: {
                  shallow: false,
               },
            }),
         }
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
