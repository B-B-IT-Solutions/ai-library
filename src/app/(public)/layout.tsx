import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { APP_NAME } from "@/lib/constants";

export type PublicLayoutProps = {
   children: React.ReactNode;
};

const PublicLayout = async (props: Readonly<PublicLayoutProps>) => {
   const { children } = props;

   return (
      <div className="flex h-full flex-col" data-testid="public-layout">
         <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <Link
                     href="/p"
                     className="flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                     <Image
                        src="/images/logo.svg"
                        width={40}
                        height={40}
                        alt={`${APP_NAME} logo`}
                        priority={true}
                        className="drop-shadow-lg"
                     />
                     <h1 className="text-xl font-bold">{APP_NAME}</h1>
                  </Link>
                  <div className="flex gap-3">
                     <Button variant="outline" asChild>
                        <Link href="/sign-in" data-testid="sign-in-link">
                           Sign In
                        </Link>
                     </Button>
                     <Button asChild>
                        <Link href="/sign-up" data-testid="sign-up-link">
                           Get Started
                        </Link>
                     </Button>
                  </div>
               </div>
            </div>
         </header>
         <main className="flex-1">{children}</main>
      </div>
   );
};

export default PublicLayout;
