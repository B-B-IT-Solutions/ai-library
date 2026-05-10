import { ReactNode } from "react";

export type PublicShellLayoutProps = {
   children: ReactNode;
   /** Logo + ggf. Navigationslinks */
   headerLeft: ReactNode;
   /** CTA-Buttons (z.B. Anmelden / Registrieren) */
   headerRight: ReactNode;
   /** Optionaler Footer-Inhalt; wird weggelassen wenn nicht übergeben */
   footer?: ReactNode;
};

/**
 * Gemeinsame Shell für öffentliche Seiten.
 * Stellt Sticky-Header, Main-Content-Bereich und optionalen Footer bereit.
 * Header- und Footer-Inhalte werden als Slots übergeben, damit jede Route
 * ihre eigene Navigation zusammenstellen kann.
 */
export const PublicShellLayout = ({
   children,
   headerLeft,
   headerRight,
   footer,
}: PublicShellLayoutProps) => {
   return (
      <div className="flex min-h-screen flex-col bg-background">
         <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
               <div className="flex items-center gap-6">{headerLeft}</div>
               <div className="flex items-center gap-2">{headerRight}</div>
            </div>
         </header>

         <main className="flex-1">{children}</main>

         {footer && (
            <footer className="border-t bg-muted/40 py-6">
               <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                  {footer}
               </div>
            </footer>
         )}
      </div>
   );
};
