import { renderHook, waitFor } from "@testing-library/react";

import { useIsMobile } from "./use-mobile";

const originalInnerWidth = window.innerWidth;

const medieaQueryList: MediaQueryList = {
   addEventListener: jest.fn(),
   removeEventListener: jest.fn(),
   addListener: jest.fn(),
   removeListener: jest.fn(),
} as unknown as MediaQueryList;

describe("useIsMobile tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   afterEach(() => {
      window.innerWidth = originalInnerWidth;
   });

   it("useIsMobile - matchMedia false - test", async () => {
      window.matchMedia = jest.fn().mockReturnValue(medieaQueryList);
      window.innerWidth = 1080;

      const { result, rerender } = renderHook(() => useIsMobile());

      expect(result.current).toEqual(false);
      expect(window.matchMedia).toHaveBeenCalledTimes(1);
      expect(medieaQueryList.addEventListener).toHaveBeenCalledTimes(1);
      expect(medieaQueryList.addEventListener).toHaveBeenCalledWith(
         "change",
         expect.any(Function)
      );

      const { addEventListener } = medieaQueryList;
      const addEventListenerMock = addEventListener as jest.MockedFunction<
         typeof addEventListener
      >;

      const callbackFn = addEventListenerMock.mock.calls[0][1] as EventListener;
      window.innerWidth = 350;

      await waitFor(() => {
         callbackFn(new Event("resized"));
      });

      rerender();
      expect(result.current).toEqual(true);
   });

   it("useIsMobile - matchMedia true - test", async () => {
      window.matchMedia = jest.fn().mockReturnValue(medieaQueryList);
      window.innerWidth = 380;

      const { result, rerender } = renderHook(() => useIsMobile());

      expect(result.current).toEqual(true);
      expect(window.matchMedia).toHaveBeenCalledTimes(1);
      expect(medieaQueryList.addEventListener).toHaveBeenCalledTimes(1);
      expect(medieaQueryList.addEventListener).toHaveBeenCalledWith(
         "change",
         expect.any(Function)
      );

      const { addEventListener } = medieaQueryList;
      const addEventListenerMock = addEventListener as jest.MockedFunction<
         typeof addEventListener
      >;

      const callbackFn = addEventListenerMock.mock.calls[0][1] as EventListener;
      window.innerWidth = 700;

      await waitFor(() => {
         callbackFn(new Event("resized"));
      });

      rerender();
      expect(result.current).toEqual(true);
   });
});
