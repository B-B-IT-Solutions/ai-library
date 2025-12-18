import { clearProps } from "./utils";

export const Presence: React.FC<{ children: React.ReactNode }> = ({
   children,
   ...props
}) => {
   clearProps(props);
   return (
      <div data-testid="mock-react-presence" {...props}>
         {children}
      </div>
   );
};

module.exports = {
   __esModule: true,
   ...jest.requireActual("@radix-ui/react-presence"),
   Presence,
};
