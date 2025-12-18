import * as React from "react";

import { clearProps } from "./utils";

type Ctx = {
   open: boolean;
   setOpen: (v: boolean) => void;
};

const SheetContext = React.createContext<Ctx | null>(null);

const Root: React.FC<{
   open: boolean;
   onOpenChange: (value: boolean) => void;
   children: React.ReactNode;
}> = ({ open = false, onOpenChange, children, ...props }) => {
   console.log("open");
   console.log(open);

   const [internalOpen, setInternalOpen] = React.useState(open);

   console.log("internalOpen");
   console.log(internalOpen);

   const setOpen = (v: boolean) => {
      setInternalOpen(v);
      onOpenChange?.(v);
   };

   return (
      <SheetContext.Provider value={{ open: internalOpen, setOpen }}>
         <div data-testid="mock-react-sheet-root" {...props}>
            {children}
         </div>
      </SheetContext.Provider>
   );
};

const Trigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
   asChild,
   children,
   ...props
}) => {
   clearProps(props);
   const ctx = React.useContext(SheetContext)!;

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
         onClick: () => ctx.setOpen(!ctx.open),
      });
   }

   return (
      <div
         onClick={() => ctx.setOpen(!ctx.open)}
         data-testid="mock-react-sheet-trigger"
         {...props}
      >
         {children}
      </div>
   );
};

const Portal: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => {
   return (
      <div data-testid="mock-react-sheet-portal" {...props}>
         {children}
      </div>
   );
};

const Content: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => {
   clearProps(props);
   const ctx = React.useContext(SheetContext)!;

   if (!ctx.open) {
      return null;
   }

   return (
      <div data-testid="mock-react-sheet-content" {...props}>
         {children}
      </div>
   );
};

const Header: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => {
   return (
      <div data-testid="mock-react-sheet-header" {...props}>
         {children}
      </div>
   );
};

const Footer: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => {
   return (
      <div data-testid="mock-react-sheet-footer" {...props}>
         {children}
      </div>
   );
};

const Close: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => {
   const ctx = React.useContext(SheetContext)!;
   return (
      <div
         onClick={() => ctx.setOpen(false)}
         data-testid="mock-react-sheet-close"
         {...props}
      >
         {children}
      </div>
   );
};

module.exports = {
   __esModule: true,
   Root,
   Trigger,
   Portal,
   Content,
   Header,
   Footer,
   Close,
};
