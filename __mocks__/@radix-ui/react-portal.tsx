import React from "react";

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return <div data-testid="mock-react-portal-root">{children}</div>;
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-portal">{children}</div>;
};

module.exports = {
   __esModule: true,
   ...jest.requireActual("@radix-ui/react-portal"),
   Root,
   Portal,
};
