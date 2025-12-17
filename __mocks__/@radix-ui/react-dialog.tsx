import React from "react";

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return <div data-testid="mock-react-dialog-root">{children}</div>;
};

const Trigger: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-dialog-trigger">{children}</div>;
};

const Portal: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-dialog-portal">{children}</div>;
};

const Overlay: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-dialog-overlay">{children}</div>;
};

const Content: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-dialog-content">{children}</div>;
};

const Title: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-dialog-title">{children}</div>;
};

const Description: React.FC<{
   children: React.ReactNode;
}> = ({ children }) => {
   return <div data-testid="mock-react-dialog-description">{children}</div>;
};

module.exports = {
   __esModule: true,
   //    ...jest.requireActual("@radix-ui/react-dialog"),
   Root,
   Trigger,
   Portal,
   Overlay,
   Content,
   Title,
   Description,
};
