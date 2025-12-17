import * as React from "react";
import { SubContent } from "@radix-ui/react-dropdown-menu";
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

type Ctx = {
   open: boolean;
   setOpen: (v: boolean) => void;
};

const DropdownContext = React.createContext<Ctx | null>(null);

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
      <DropdownContext.Provider value={{ open: internalOpen, setOpen }}>
         <div data-testid="mock-react-dropdown-menu-root" {...props}>
            {children}
         </div>
      </DropdownContext.Provider>
   );
};

const Trigger: React.FC<{
   asChild: boolean;
   children: React.ReactNode;
}> = ({ asChild, children, ...props }) => {
   clearProps(props);
   const ctx = React.useContext(DropdownContext)!;

   if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
         onClick: () => ctx.setOpen(!ctx.open),
      });
   }

   return (
      <div
         onClick={() => ctx.setOpen(!ctx.open)}
         data-testid="mock-react-dropdown-menu-trigger"
         {...props}
      >
         {children}
      </div>
   );
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-portal" {...props}>
         {children}
      </div>
   );
};

const Content: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   clearProps(props);
   const ctx = React.useContext(DropdownContext)!;
   if (!ctx.open) {
      return null;
   }

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
   onSelect: () => void;
}> = ({ children, onSelect, ...props }) => {
   const ctx = React.useContext(DropdownContext)!;

   return (
      <div
         onClick={() => {
            onSelect?.();
            ctx.setOpen(false);
         }}
         data-testid="mock-react-dropdown-menu-item"
         {...props}
      >
         {children}
      </div>
   );
};

const CheckboxItem: React.FC<{
   children: React.ReactNode;
   checked: boolean;
   onCheckedChange: (checked: boolean) => void;
}> = ({ children, checked, onCheckedChange, ...props }) => {
   return (
      <div
         onClick={() => onCheckedChange?.(!checked)}
         data-testid="mock-react-dropdown-menu-check-box-item"
         {...props}
      >
         {children}
      </div>
   );
};

const RadioGroup: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-radio-group" {...props}>
         {children}
      </div>
   );
};

const RadioItem: React.FC<{
   value: boolean;
   onSelect: (value: boolean) => void;
   children: React.ReactNode;
}> = ({ value, onSelect, children, ...props }) => {
   return (
      <div
         onClick={() => onSelect?.(value)}
         data-testid="mock-react-dropdown-menu-radio-item"
         {...props}
      >
         {children}
      </div>
   );
};

const Sub: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-sub" {...props}>
         {children}
      </div>
   );
};

const SubTrigger: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   return (
      <div data-testid="mock-react-dropdown-menu-sub-trigger" {...props}>
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
   Root,
   Trigger,
   Portal,
   Content,
   Group,
   Label,
   Item,
   CheckboxItem,
   RadioGroup,
   RadioItem,
   Separator,
   Sub,
   SubTrigger,
   SubContent,
   ItemIndicator,
};
