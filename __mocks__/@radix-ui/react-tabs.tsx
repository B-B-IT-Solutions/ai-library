import * as React from "react";

type TabsContextType = {
   activeTab: string;
   setActiveTab: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

const Root: React.FC<{
   defaultValue?: string;
   value?: string;
   onValueChange?: (value: string) => void;
   children: React.ReactNode;
}> = ({ defaultValue = "", value, onValueChange, children, ...props }) => {
   const [activeTab, setActiveTab] = React.useState(value ?? defaultValue);

   React.useEffect(() => {
      if (value !== undefined) setActiveTab(value);
   }, [value]);

   const handleChange = (v: string) => {
      setActiveTab(v);
      onValueChange?.(v);
   };

   return (
      <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
         <div data-testid="mock-react-tabs-root" {...props}>
            {children}
         </div>
      </TabsContext.Provider>
   );
};

const List: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => (
   <div data-testid="mock-react-tabs-list" {...props}>
      {children}
   </div>
);

const Trigger: React.FC<{
   value: string;
   children: React.ReactNode;
   disabled?: boolean;
}> = ({ value, children, disabled, ...props }) => {
   const ctx = React.useContext(TabsContext)!;
   const isActive = ctx.activeTab === value;

   return (
      <button
         type="button"
         data-testid={`mock-react-tabs-trigger-${value}`}
         data-state={isActive ? "active" : "inactive"}
         disabled={disabled}
         onClick={() => ctx.setActiveTab(value)}
         {...props}
      >
         {children}
      </button>
   );
};

const Content: React.FC<{
   value: string;
   children: React.ReactNode;
}> = ({ value, children, ...props }) => {
   const ctx = React.useContext(TabsContext)!;
   if (ctx.activeTab !== value) return null;

   return (
      <div data-testid={`mock-react-tabs-content-${value}`} {...props}>
         {children}
      </div>
   );
};

module.exports = {
   __esModule: true,
   Root,
   List,
   Trigger,
   Content,
};
