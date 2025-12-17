import React from "react";

import { clearProps } from "./utils";

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return <div data-testid="mock-react-portal-root">{children}</div>;
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children, ...props }) => {
   clearProps(props);
   return (
      <div data-testid="mock-react-portal" {...props}>
         {children}
      </div>
   );
};

module.exports = {
   __esModule: true,
   ...jest.requireActual("@radix-ui/react-portal"),
   Root,
   Portal,
};
