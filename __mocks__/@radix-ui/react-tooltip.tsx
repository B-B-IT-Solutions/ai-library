import React from "react";

import { clearProps } from "./utils";

const Provider: React.FC<{
   children: React.ReactNode;
   delayDuration?: number;
}> = ({ children }) => <>{children}</>;

const Root: React.FC<{
   children: React.ReactNode;
   open?: boolean;
   defaultOpen?: boolean;
   onOpenChange?: (open: boolean) => void;
}> = ({ children }) => <>{children}</>;

const Trigger: React.FC<{
   asChild?: boolean;
   children: React.ReactNode;
}> = ({ asChild, children, ...props }) => {
   clearProps(props);

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, props);
   }

   return (
      <button data-testid="mock-tooltip-trigger" {...props}>
         {children}
      </button>
   );
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => <>{children}</>;

const Content: React.FC<{
   children: React.ReactNode;
   sideOffset?: number;
   className?: string;
   [key: string]: any;
}> = ({ children, ...props }) => {
   clearProps(props);
   return (
      <div data-testid="mock-tooltip-content" {...props}>
         {children}
      </div>
   );
};

const Arrow: React.FC = () => null;

module.exports = {
   __esModule: true,
   Provider,
   Root,
   Trigger,
   Portal,
   Content,
   Arrow,
};
