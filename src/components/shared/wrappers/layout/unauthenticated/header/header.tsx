import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export type Props = {
   authenticated: boolean;
};

export const Header = ({ authenticated }: Props) => {
   return (
      <header className="border-b bg-background" data-testid="header">
         <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="flex-1">
               <Link
                  href="/"
                  className="text-lg font-bold whitespace-nowrap sm:text-xl"
                  data-testid="app-link"
               >
                  {APP_NAME}
               </Link>
            </div>
            <div className="flex-2">
               <DesktopNav authenticated={authenticated} />
               <MobileNav authenticated={authenticated} />
            </div>
         </div>
      </header>
   );
};
