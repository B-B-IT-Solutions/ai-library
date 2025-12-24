import { cookies } from "next/headers";

import { auth } from "@/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar";
import { Sidebar } from "@/components/shared";

export type MainLayoutProps = {
   children: React.ReactNode;
};

const MainLayout = async (props: Readonly<MainLayoutProps>) => {
   const session = await auth();
   const cookieStore = await cookies();

   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

   const { children } = props;

   return (
      <div className="h-full flex flex-row" data-testid="main-layout">
         <SidebarProvider defaultOpen={defaultOpen}>
            <Sidebar user={session?.user} />
            <main className="flex-1 wrapper">
               <SidebarTrigger />
               {children}
            </main>
         </SidebarProvider>
      </div>
   );
};

export default MainLayout;
