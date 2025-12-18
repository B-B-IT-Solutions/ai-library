import "next-router-mock";

declare module "next-router-mock" {
   interface MemoryRouter {
      refresh: () => void;
   }
}
