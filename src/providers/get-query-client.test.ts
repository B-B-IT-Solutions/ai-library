import {
   defaultShouldDehydrateQuery,
   Query,
   QueryClient,
} from "@tanstack/react-query";

jest.mock("@tanstack/react-query", () => ({
   ...jest.requireActual("@tanstack/react-query"),
   isServer: false, // default for tests
}));

// Helpers
const setIsServer = (value: boolean) => {
   (jest.requireMock("@tanstack/react-query").isServer as boolean) = value;
};

describe("getQueryClient functionality tests", () => {
   beforeEach(() => {
      jest.resetModules();
   });

   test("getQueryClient - isServer true - test", async () => {
      setIsServer(true);

      const { getQueryClient: freshGetQueryClient } = await import(
         "./get-query-client"
      );

      const c1 = freshGetQueryClient();
      const c2 = freshGetQueryClient();

      expect(c1).toBeDefined();
      expect(c2).toBeDefined();
      expect(c1).not.toBe(c2);
   });

   test("getQueryClient - isServer false - test", async () => {
      setIsServer(false);

      const { getQueryClient: freshGetQueryClient } = await import(
         "./get-query-client"
      );

      const c1 = freshGetQueryClient();
      const c2 = freshGetQueryClient();

      expect(c1).toBeDefined();
      expect(c2).toBeDefined();
      expect(c1).toBe(c2);
   });

   test("getQueryClient - shouldDehydrate - status success - test", async () => {
      setIsServer(false);

      const { getQueryClient: freshGetQueryClient } = await import(
         "./get-query-client"
      );

      const qc = freshGetQueryClient();

      const shouldDehydrate =
         qc.getDefaultOptions().dehydrate!.shouldDehydrateQuery!;
      const queries = qc.getDefaultOptions().queries!;

      const query = {
         state: { status: "success" },
      } as Query;

      const shouldDehydrateResult = shouldDehydrate(query);
      const expectedShouldDehydrateResult = defaultShouldDehydrateQuery(query);
      const expectedQueries = {
         staleTime: 60 * 1000,
      };

      expect(shouldDehydrateResult).toEqual(expectedShouldDehydrateResult);
      expect(queries).toEqual(expectedQueries);

      expect(shouldDehydrate(query)).toBe(defaultShouldDehydrateQuery(query));
   });

   test("getQueryClient - shouldDehydrate - status pending - test", async () => {
      setIsServer(false);

      const { getQueryClient: freshGetQueryClient } = await import(
         "./get-query-client"
      );

      const qc = freshGetQueryClient();

      const shouldDehydrate =
         qc.getDefaultOptions().dehydrate!.shouldDehydrateQuery!;
      const queries = qc.getDefaultOptions().queries!;

      const query = {
         state: { status: "pending" },
      } as Query;
      const shouldDehydrateResult = shouldDehydrate(query);
      const expectedQueries = {
         staleTime: 60 * 1000,
      };

      expect(shouldDehydrateResult).toEqual(true);
      expect(queries).toEqual(expectedQueries);
   });
});
