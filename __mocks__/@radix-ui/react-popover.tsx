import * as React from "react";

import { clearProps } from "./utils";

type PopoverContextType = {
   open: boolean;
   setOpen: (v: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextType | null>(null);

const Root: React.FC<{
   open?: boolean;
   onOpenChange?: (value: boolean) => void;
   children: React.ReactNode;
}> = ({ open = false, onOpenChange, children, ...props }) => {
   const [internalOpen, setInternalOpen] = React.useState(open);

   React.useEffect(() => {
      setInternalOpen(open);
   }, [open]);

   const setOpen = (v: boolean) => {
      setInternalOpen(v);
      onOpenChange?.(v);
   };

   return (
      <PopoverContext.Provider value={{ open: internalOpen, setOpen }}>
         <div data-testid="mock-react-popover-root" {...props}>
            {children}
         </div>
      </PopoverContext.Provider>
   );
};

const Trigger: React.FC<{
   asChild?: boolean;
   children: React.ReactNode;
}> = ({ asChild, children, ...props }) => {
   clearProps(props);
   const ctx = React.useContext(PopoverContext)!;

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
         onClick: () => ctx.setOpen(!ctx.open),
      });
   }

   return (
      <button
         onClick={() => ctx.setOpen(!ctx.open)}
         data-testid="mock-react-popover-trigger"
         {...props}
      >
         {children}
      </button>
   );
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-popover-portal" {...props}>
         {children}
      </div>
   );
};

const Content: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   clearProps(props);
   const ctx = React.useContext(PopoverContext)!;

   if (!ctx.open) {
      return null;
   }

   return (
      <div data-testid="mock-react-popover-content" {...props}>
         {children}
      </div>
   );
};

const Anchor: React.FC<{
   children?: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-popover-anchor" {...props}>
         {children}
      </div>
   );
};

const Close: React.FC<{
   asChild?: boolean;
   children: React.ReactNode;
}> = ({ asChild, children, ...props }) => {
   const ctx = React.useContext(PopoverContext)!;

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
         onClick: () => ctx.setOpen(false),
      });
   }

   return (
      <button
         onClick={() => ctx.setOpen(false)}
         data-testid="mock-react-popover-close"
         {...props}
      >
         {children}
      </button>
   );
};

module.exports = {
   __esModule: true,
   Root,
   Trigger,
   Portal,
   Content,
   Anchor,
   Close,
};
