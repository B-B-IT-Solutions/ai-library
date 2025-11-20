export type MainLayoutProps = {
   children: React.ReactNode;
};

const MainLayout = (props: Readonly<MainLayoutProps>) => {
   const { children } = props;
   return (
      <div className="flex h-screen flex-col" data-testid="main-layout">
         <main className="flex-1 wrapper">{children}</main>
      </div>
   );
};

export default MainLayout;
