import * as React from "react";

type DialogContextType = {
   open: boolean;
   setOpen: (v: boolean) => void;
};

const DialogContext = React.createContext<DialogContextType | null>(null);

const Root: React.FC<{
   open: boolean;
   onOpenChange: (value: boolean) => void;
   children: React.ReactNode;
}> = ({ open = false, onOpenChange, children, ...props }) => {
   const [internalOpen, setInternalOpen] = React.useState(open);

   const setOpen = (v: boolean) => {
      setInternalOpen(v);
      onOpenChange?.(v);
   };

   return (
      <DialogContext.Provider value={{ open: internalOpen, setOpen }}>
         <div data-testid="mock-react-dialog-root" {...props}>
            {children}
         </div>
      </DialogContext.Provider>
   );
};

const Trigger: React.FC<{
   children: React.ReactNode;
   asChild: boolean;
}> = ({ children, asChild, ...props }) => {
   const ctx = React.useContext(DialogContext)!;

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
         onClick: () => ctx.setOpen(true),
      });
   }

   return (
      <button
         onClick={() => ctx.setOpen(true)}
         data-testid="mock-react-dialog-trigger"
         {...props}
      >
         {children}
      </button>
   );
};

const Content: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   const ctx = React.useContext(DialogContext)!;
   if (!ctx.open) {
      return null;
   }
   return (
      <div data-testid="mock-react-dialog-content" {...props}>
         {children}
      </div>
   );
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dialog-portal" {...props}>
         {children}
      </div>
   );
};

const Overlay: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dialog-overlay" {...props}>
         {children}
      </div>
   );
};

const Title: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dialog-title" {...props}>
         {children}
      </div>
   );
};

const Description: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dialog-description" {...props}>
         {children}
      </div>
   );
};

const Close = ({ children }: any) => {
   const ctx = React.useContext(DialogContext)!;
   return <button onClick={() => ctx.setOpen(false)}>{children}</button>;
};

module.exports = {
   __esModule: true,
   Root,
   Trigger,
   Portal,
   Overlay,
   Content,
   Title,
   Description,
   Close,
};
