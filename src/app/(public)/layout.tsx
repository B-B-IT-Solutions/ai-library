export type PublicLayoutProps = {
   children: React.ReactNode;
};

const PublicLayout = async (props: Readonly<PublicLayoutProps>) => {
   const { children } = props;

   return (
      <div className="h-full flex flex-row" data-testid="public-layout">
         <main className="flex-1 wrapper">{children}</main>
      </div>
   );
};

export default PublicLayout;
