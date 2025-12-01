import mockRouter from "next-router-mock";

module.exports = {
   __esModule: true,
   ...jest.requireActual("next-router-mock"),
   useRouter: () => mockRouter,
   usePathname() {
      return mockRouter.pathname;
   },
   useSearchParams: jest.fn(() => {
      if (mockRouter.query) {
         const params = mockRouter.query as unknown as URLSearchParams;
         return new URLSearchParams(params);
      }
      return new URLSearchParams("");
   }),
   useServerInsertedHTML: jest.fn(),
   redirect: jest.fn(),
   notFound: jest.fn(),
};
