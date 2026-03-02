import { JSX } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
   render,
   renderHook,
   RenderHookResult,
   screen,
   within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider/next-13.5";
import {
   NuqsTestingAdapter,
   type OnUrlUpdateFunction,
} from "nuqs/adapters/testing";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import { TooltipProvider } from "@/components/shadcn/tooltip";

export const typeIntoInput = async (testId: string, value: string) => {
   const field = screen.getByTestId(testId);
   const input = within(field).getByTestId("input");
   await userEvent.type(input, value);
};

export const typeIntoTextArea = async (testId: string, value: string) => {
   const field = screen.getByTestId(testId);
   const input = within(field).getByTestId("textarea");
   await userEvent.type(input, value);
};

export const typeIntoTipTap = async (testId: string, value: string) => {
   const content = screen.getByTestId(testId).querySelector("input")!;
   await userEvent.type(content, value);
};

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

export const withClientWrapper = (
   url: string = "/",
   searchParams?: string,
   onNuqsUrlUpdate?: OnUrlUpdateFunction
) => {
   const queryClient = testQueryClient();
   mockRouter.push(url);

   const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return (
         <QueryClientProvider client={queryClient}>
            <MemoryRouterProvider url={url}>
               <NuqsTestingAdapter
                  searchParams={`?${searchParams}`}
                  onUrlUpdate={onNuqsUrlUpdate}
                  defaultOptions={{
                     shallow: false,
                  }}
               >
                  <TooltipProvider>{children}</TooltipProvider>
               </NuqsTestingAdapter>
            </MemoryRouterProvider>
         </QueryClientProvider>
      );
   };

   return Wrapper;
};

export const renderAsyncRSC = async <T,>(
   rscComponent: (props: T) => Promise<JSX.Element>,
   props: T,
   searchParams?: string
) => {
   const component = await rscComponent(props);
   return render(component, {
      wrapper: withRSCWrapper(searchParams),
   });
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
   return render(component, {
      wrapper: withClientWrapper(url, searchParams, onNuqsUrlUpdate),
   });
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
   return renderHook(() => hookUnderTest(), {
      wrapper: withClientWrapper(),
   });
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
