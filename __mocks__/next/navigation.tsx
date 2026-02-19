import mockRouter from "next-router-mock";

mockRouter.replace = jest.fn();
mockRouter.refresh = jest.fn();
mockRouter.back = jest.fn();

module.exports = {
   __esModule: true,
   ...jest.requireActual("next-router-mock"),
   useRouter: () => {
      return mockRouter;
   },
   usePathname() {
      return mockRouter.pathname;
   },
   useSearchParams: () => {
      if (mockRouter.query) {
         const params = mockRouter.query as unknown as URLSearchParams;
         return new URLSearchParams(params);
      }

      return new URLSearchParams("");
   },
   useServerInsertedHTML: jest.fn(),
   redirect: jest.fn(),
   notFound: jest.fn(),
};
