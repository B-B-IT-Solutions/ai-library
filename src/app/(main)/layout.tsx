import { Sidebar } from "@/components/shared/sidebar";

export type MainLayoutProps = {
   children: React.ReactNode;
};

const MainLayout = (props: Readonly<MainLayoutProps>) => {
   const { children } = props;
   return (
      <div className="h-full flex flex-row" data-testid="main-layout">
         <Sidebar />
         <main className="flex-1 wrapper">{children}</main>
      </div>
   );
};

export default MainLayout;
