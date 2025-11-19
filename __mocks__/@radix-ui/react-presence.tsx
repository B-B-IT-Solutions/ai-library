export const Presence: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => <div data-testid="mock-react-presence">{children}</div>;

module.exports = {
   __esModule: true,
   ...jest.requireActual("@radix-ui/react-presence"),
   Presence,
};
