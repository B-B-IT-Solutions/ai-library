export const SessionProvider: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div data-testid="mock-session-provider">{children}</div>
);

export const useSession = jest.fn();
export const getProviders = jest.fn();
export const signIn = jest.fn();
export const signOut = jest.fn();

const mock = {
  __esModule: true,
  SessionProvider,
  useSession,
  getProviders,
  signIn,
  signOut,
};

export default mock;
