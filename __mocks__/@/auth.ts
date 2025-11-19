module.exports = {
   __esModule: true,
   handlers: {
      GET: jest.fn(),
      POST: jest.fn(),
   },
   auth: jest.fn(),
   signIn: jest.fn(),
   signOut: jest.fn(),
};
