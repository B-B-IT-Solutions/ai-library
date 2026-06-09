import * as React from "react";
import { SubContent } from "@radix-ui/react-dropdown-menu";

import { clearProps } from "./utils";

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

type TriggerProps = { children: React.ReactNode; asChild: boolean };

const Trigger = ({ asChild, children, ...props }: TriggerProps) => {
   clearProps(props);
   const ctx = React.useContext(DropdownContext)!;

   const handleClick = () => {
      ctx.setOpen(!ctx.open);
   };

   if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ onClick?: () => void }>;
      const childOnClick = child.props.onClick;
      return React.cloneElement(child, {
         ...props,
         onClick: () => {
            childOnClick?.();
            handleClick();
         },
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

type ItemProps = {
   children: React.ReactNode;
   asChild?: boolean;
   onSelect?: () => void;
   onClick?: React.MouseEventHandler<HTMLElement>;
};

const Item = ({
   children,
   onSelect,
   asChild,
   onClick,
   ...props
}: ItemProps) => {
   clearProps(props);
   const ctx = React.useContext(DropdownContext)!;

   const handleClick = () => {
      const event = {
         preventDefault: jest.fn(),
      } as unknown as React.MouseEvent<HTMLElement>;

      onClick?.(event);
      onSelect?.();
      ctx?.setOpen(false);
   };

   if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ onClick?: () => void }>;
      const childOnClick = child.props.onClick;
      return React.cloneElement(child, {
         ...props,
         onClick: () => {
            childOnClick?.();
            handleClick();
         },
      });
   }

   return (
      <div
         onClick={handleClick}
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
