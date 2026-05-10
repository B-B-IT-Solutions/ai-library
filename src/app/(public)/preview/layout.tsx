import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { PublicShellLayout } from "@/components/shared/wrappers/public-shell-layout";
import { APP_NAME } from "@/lib/constants";

export type PreviewLayoutProps = {
   children: React.ReactNode;
};

const PreviewLayout = async (props: Readonly<PreviewLayoutProps>) => {
   const { children } = props;

   const headerLeft = (
      <>
         <Link href="/" className="text-xl font-bold">
            {APP_NAME}
         </Link>
         <nav className="hidden items-center gap-6 md:flex">
            <Link
               href="/preview/marketplace"
               className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
               Bibliothek
            </Link>
         </nav>
      </>
   );

   const headerRight = (
      <>
         <Button variant="outline" asChild>
            <Link href="/auth/sign-in" data-testid="sign-in-link">
               Anmelden
            </Link>
         </Button>
         <Button asChild>
            <Link href="/auth/sign-up" data-testid="sign-up-link">
               Kostenlos starten
            </Link>
         </Button>
      </>
   );

   const footer = (
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
         <Link href="/" className="text-sm font-semibold transition-opacity hover:opacity-80">
            {APP_NAME}
         </Link>
         <nav className="flex gap-6">
            <Link
               href="/preview/marketplace"
               className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
               Bibliothek
            </Link>
         </nav>
         <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}
         </p>
      </div>
   );

   return (
      <PublicShellLayout
         headerLeft={headerLeft}
         headerRight={headerRight}
         footer={footer}
      >
         <div data-testid="public-layout">{children}</div>
      </PublicShellLayout>
   );
};

export default PreviewLayout;
