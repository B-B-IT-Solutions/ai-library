import React from "react";
import { get, has, set, unset } from "es-toolkit/compat";

const clearProps = (props: object) => {
   if (has(props, "asChild")) {
      unset(props, "asChild");
   }
   if (has(props, "sideOffset")) {
      const value = get(props, "sideOffset");
      set(props, "sideoffset", value);
      unset(props, "sideOffset");
   }
   if (has(props, "forceMount")) {
      unset(props, "forceMount");
   }
};

const Root: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => {
   return (
      <div data-testid="mock-react-dropdown-menu-root" {...props}>
         {children}
      </div>
   );
};

const Trigger: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   clearProps(props);
   return (
      <div data-testid="mock-react-dropdown-menu-trigger" {...props}>
         {children}
      </div>
   );
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-dropdown-menu-portal">{children}</div>;
};

const Content: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   clearProps(props);
   return (
      <div data-testid="mock-react-dropdown-menu-content" {...props}>
         {children}
      </div>
   );
};

const Group: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   clearProps(props);
   return (
      <div data-testid="mock-react-dropdown-menu-group" {...props}>
         {children}
      </div>
   );
};

const Label: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-label" {...props}>
         {children}
      </div>
   );
};

const Item: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-item" {...props}>
         {children}
      </div>
   );
};

const CheckboxItem: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-check-box-item" {...props}>
         {children}
      </div>
   );
};

const Separator: React.FC = ({ ...props }) => {
   return <div data-testid="mock-react-dropdown-menu-separator" {...props} />;
};

const ItemIndicator: React.FC = ({ ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-item-indicator" {...props} />
   );
};

module.exports = {
   __esModule: true,
   ...jest.requireActual("@radix-ui/react-dropdown-menu"),
   Root,
   Trigger,
   Portal,
   Content,
   Group,
   Label,
   Item,
   CheckboxItem,
   Separator,
   ItemIndicator,
};
