export type AuthLayoutProps = {
   children: React.ReactNode;
};

export const AuthLayout = (props: Readonly<AuthLayoutProps>) => {
   const { children } = props;
   return (
      <div
         className="flex-center min-h-screen w-full"
         data-testid="auth-layout"
      >
         {children}
      </div>
   );
};

export default AuthLayout;
