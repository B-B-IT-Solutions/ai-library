import React, { ReactNode } from "react";

import { clearProps } from "./utils";

type ProviderProps = { children: ReactNode; delayDuration?: number };

const Provider = ({ children }: ProviderProps) => <>{children}</>;

type RootProps = {
   children: ReactNode;
   open?: boolean;
   defaultOpen?: boolean;
   onOpenChange?: (open: boolean) => void;
};

const Root = ({ children }: RootProps) => <>{children}</>;

type TriggerProps = {
   asChild?: boolean;
   children: ReactNode;
};

const Trigger = ({ asChild, children, ...props }: TriggerProps) => {
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

type PortalProps = {
   children: ReactNode;
};

const Portal = ({ children }: PortalProps) => <>{children}</>;

type ContentProps = {
   children: ReactNode;
   sideOffset?: number;
   className?: string;
   [key: string]: any;
};

const Content = ({ children, ...props }: ContentProps) => {
   clearProps(props);
   return (
      <div data-testid="mock-tooltip-content" {...props}>
         {children}
      </div>
   );
};

const Arrow = () => null;

module.exports = {
   __esModule: true,
   Provider,
   Root,
   Trigger,
   Portal,
   Content,
   Arrow,
};
