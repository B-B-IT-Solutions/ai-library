import * as React from "react";

type AlertDialogContextType = {
   open: boolean;
   setOpen: (v: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextType | null>(
   null
);

const Root: React.FC<{
   open: boolean;
   onOpenChange: (value: boolean) => void;
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
      <AlertDialogContext.Provider value={{ open: internalOpen, setOpen }}>
         <div data-testid="mock-react-alert-dialog-root" {...props}>
            {children}
         </div>
      </AlertDialogContext.Provider>
   );
};

const Trigger: React.FC<{
   children: React.ReactNode;
   asChild?: boolean;
}> = ({ children, asChild, ...props }) => {
   const ctx = React.useContext(AlertDialogContext)!;

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
         onClick: () => ctx.setOpen(true),
      });
   }

   return (
      <button
         onClick={() => ctx.setOpen(true)}
         data-testid="mock-react-alert-dialog-trigger"
         {...props}
      >
         {children}
      </button>
   );
};

const Content: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   const ctx = React.useContext(AlertDialogContext)!;
   if (!ctx.open) {
      return null;
   }
   return (
      <div data-testid="mock-react-alert-dialog-content" {...props}>
         {children}
      </div>
   );
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-alert-dialog-portal" {...props}>
         {children}
      </div>
   );
};

const Overlay: React.FC<{
   children?: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-alert-dialog-overlay" {...props}>
         {children}
      </div>
   );
};

const Title: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-alert-dialog-title" {...props}>
         {children}
      </div>
   );
};

const Description: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-alert-dialog-description" {...props}>
         {children}
      </div>
   );
};

const Action: React.FC<{
   children: React.ReactNode;
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}> = ({ children, onClick, ...props }) => {
   return (
      <button
         onClick={onClick}
         data-testid="mock-react-alert-dialog-action"
         {...props}
      >
         {children}
      </button>
   );
};

const Cancel: React.FC<{
   children: React.ReactNode;
   disabled?: boolean;
   className?: string;
}> = ({ children, ...props }) => {
   const ctx = React.useContext(AlertDialogContext)!;
   return (
      <button
         onClick={() => ctx.setOpen(false)}
         data-testid="mock-react-alert-dialog-cancel"
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
   Overlay,
   Content,
   Title,
   Description,
   Action,
   Cancel,
};
