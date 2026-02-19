import { renderHook, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";

import { useSetUrlSearchParams } from "./use-set-url-search-params";

describe("useSetUrlSearchParams tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("should set a search param on the current path", async () => {
      mockRouter.push("/test");
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("foo", "bar");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/test?foo=bar");
   });

   it("should update an existing search param", async () => {
      mockRouter.push("/test?foo=old");
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("foo", "new");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/test?foo=new");
   });

   it("should preserve existing search params when adding a new one", async () => {
      mockRouter.push("/test?existing=value");
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("new", "param");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith(
         "/test?existing=value&new=param"
      );
   });

   it("should work with root path", async () => {
      const { result } = renderHook(() => useSetUrlSearchParams());

      await waitFor(() => {
         result.current.setUrlSearchParams("key", "value");
      });

      expect(mockRouter.replace).toHaveBeenCalledWith("/?key=value");
   });
});
