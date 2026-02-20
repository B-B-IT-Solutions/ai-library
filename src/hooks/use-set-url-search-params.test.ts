import { renderHook, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";

import { useSetUrlSearchParams } from "./use-set-url-search-params";

describe("useSetUrlSearchParams tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("setUrlSearchParams - set param - test", async () => {
      mockRouter.push("/test");
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("foo", "bar");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/test?foo=bar");
   });

   it("setUrlSearchParams - update existing param - test", async () => {
      mockRouter.push("/test?foo=old");
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("foo", "new");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/test?foo=new");
   });

   it("setUrlSearchParams - preserve existing - add new param - test", async () => {
      mockRouter.push("/test?existing=value");
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("new", "param");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith(
         "/test?existing=value&new=param"
      );
   });

   it("setUrlSearchParams - working with root path - test", async () => {
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("key", "value");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/?key=value");
   });
});
